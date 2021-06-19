import React, {useEffect, useState} from "react";
import QrReader from "react-qr-reader";
import {
    checkUserIsLate,
    shiftStartedTime,
    parseScanData,
    countMinutesLate,
    getUserLocation,
} from "../helpers/functions.js";
import {checkShift, setShiftToDb, getCurrentTimeStamp, getUserData} from "../api";
import RedCheck from "../assets/images/check_red.svg";
import Check from "../assets/images/check.svg";
import Spinner from "../components/Spinner";
import classifyPoint from "robust-point-in-polygon";
import {ERROR, FAIL, OLOLO_GROUP, OLOLO_POLYGON, polygon, SUCCESS, TEST} from "../constants";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {useLocationToast} from "../utils/useLocationToast";
import useAuth from "../context/AuthContextProvider.js";

const Scanner = () => {
    const [access, setAccess] = useState(false);
    const [loader, setLoader] = useState(true);
    const {user, setUser} = useAuth();
    const [shift, setShift] = useState("");
    const [success, error, locFail, handleLocation] = useLocationToast();
    const [location, setLocation] = useState(false);
    const [isLate, setIsLate] = useState(false);


    useEffect(() => {
        getUserLocation(checkUserLocation, handleLocError);
    }, [user]);

    useEffect(() => {
        // check if user already shifted
        setLoader(true)
        checkUserShift().then(() => console.log('ok got user'));

    }, []);

    async function checkUserShift() {
        try {
            const res = await checkShift(user.uid);
            console.log(res, 'this is res')
            setUser({
                ...user,
                ...res,
                dueTime: res.dueTime.toDate()
            })
            if (res?.hasScanned) {
                setIsLate(res.isLate);
                setShift(shiftStartedTime(res.date.toDate()));
                setAccess(true);
                setLoader(false);
            }
        } catch (e) {
            console.log(e.message);
            setLoader(false);
        } finally {
            setLoader(false);
        }
    }

    const checkUserLocation = (position) => {
        const {latitude, longitude} = position.coords;

        let loc;

        loc = classifyPoint(polygon, [latitude, longitude]);


        if (user?.adress === OLOLO_GROUP) {
            console.log('worked')
            loc = classifyPoint(OLOLO_POLYGON, [latitude, longitude])
        }

        if (loc === -1 || loc === 0) {
            setLocation(true);
            handleLocation(SUCCESS);
            return;
        }

        console.log(latitude, longitude);


        handleLocation(FAIL);
        setLocation(false);
    };

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function handleLocError(error) {
        console.log(error);
        handleLocation(ERROR);
    }

    const handleScan = async (result) => {
        if (!result) return;

        const permission = parseScanData(result);

        let date = new Date();
        let is_late = false;
        let minutesLate = 0;

        if (!location || !permission) {
            return;
        }

        setLoader(true);

        try {
            date = (await getCurrentTimeStamp()) || new Date();
            setShift(shiftStartedTime(date));
        } catch (e) {
            console.log(e.message);
        }

        if (checkUserIsLate(date, user.dueTime)) {
            is_late = true;
            minutesLate = countMinutesLate(date, user.dueTime);
        }

        if (is_late) {
            setIsLate(true);
        }

        const userShift = {
            ...user,
            date,
            hasScanned: true,
            location,
            isLate: is_late,
            minutesLate,
        };

        setShiftToDb(date, userShift).then(() => {
            setAccess(true);
            setLoader(false);
        });
    };

    if (loader) {
        return (
            <div className="loader-container">
                <Spinner loader={loader}/>
            </div>
        );
    }

    // TODO: Переписать логику тостеров, или использовать другую библиотеку

    const handleCloseError = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        handleLocation(ERROR);
    };

    const handleCloseSuccess = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        handleLocation(SUCCESS);
    };

    const handleCloseFail = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        handleLocation(FAIL);
    };

    const handleError = (error) => {
        console.error(error);
    };

    return (
        <div
            className="w-full flex-c-m m-b-50 overlay"
            style={{height: "100vh"}}
        >
            <Snackbar
                open={locFail}
                autoHideDuration={3000}
                onClose={handleCloseFail}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert onClose={handleCloseFail} severity="warning">
                    Геопозиция не соответcвует <br/> или перезагрузите
                    приложение
                </Alert>
            </Snackbar>
            <Snackbar
                open={error}
                autoHideDuration={3000}
                onClose={handleCloseError}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert onClose={handleCloseError} severity="error">
                    Предоставьте доступ к вашей локации <br/> или перезагрузите
                    приложение
                </Alert>
            </Snackbar>
            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={handleCloseSuccess}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert onClose={handleCloseSuccess} severity="success">
                    Локация определена
                </Alert>
            </Snackbar>
            {access ? (
                <div
                    className="paper flex-col-c-m"
                    data-aos="zoom-in-up"
                    data-aos-delay="300"
                    style={{
                        width: "300px",
                        padding: "40px",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                    }}
                >
                    {isLate ? (
                        <img
                            data-aos="flip-down"
                            data-aos-delay="600"
                            style={{width: "90px"}}
                            src={RedCheck}
                            alt="Late"
                        />
                    ) : (
                        <img
                            data-aos="flip-down"
                            data-aos-delay="600"
                            style={{width: "90px"}}
                            src={Check}
                            alt="On time"
                        />
                    )}
                    <p className="fs-18 text-center m-t-30">
                        {"Вы вошли в систему"}
                    </p>
                    <p className="fs-18">{shift}</p>
                </div>
            ) : (
                <QrReader
                    delay={800}
                    onError={handleError}
                    onScan={handleScan}
                    className="scanner"
                />
            )}
        </div>
    );
};

export default Scanner;
