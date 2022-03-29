import { Server } from 'socket.io';
import fs from 'fs';

export let date;
export let time;
const colours = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m" 
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};

export async function LogsError(error) {

    if (typeof fs !== 'undefined') {

        //console.log(error)

        if (typeof process.env.LOG_FOLDER !== 'undefined') {


            getDate();
            console.log(`${colours.fg.red}------------------------------`);
            console.info(`| ${colours.fg.yellow}[Error : ${date} / ${time}] ${colours.fg.red}|`)
            console.log(`------------------------------${colours.reset}`);


            if (typeof error === 'object' && typeof error !== 'undefined') {

                let pathToWrite = process.env.INIT_CWD + process.env.LOG_FOLDER + "\\"+ date + ".txt"
                let errorClear = `\n--------[Error : ${date} / ${time}]---------------------------------------------------\n`;
                let errorTab = `\n-------------------------------\n`;
                let errorBuilder = `${errorClear}`;

                if (typeof error.response !== 'undefined' && typeof error.response == 'object') {

                    if (typeof error.response.status !== 'undefined' && typeof error.response.status == 'number') {
                        errorBuilder += `status : ${error.response.status} ${errorTab}`
                    }


                    if (typeof error.response.statusText !== 'undefined' && typeof error.response.statusText == 'string') {
                        errorBuilder += `status Text : ${error.response.statusText} ${errorTab}`
                    }


                }

                if (typeof error.name !== 'undefined' && typeof error.name == 'string') {
                    errorBuilder += `Exception type : ${error.name} ${errorTab}`
                }

                if (typeof error.message !== 'undefined' && typeof error.message == 'string') {
                    errorBuilder += `Message : ${error.message} ${errorTab}`
                }

                if (typeof error.fileName !== 'undefined' && typeof error.fileName == 'string') {
                    errorBuilder += `File : ${error.fileName} ${errorTab}`
                }

                if (typeof error.lineNumber !== 'undefined' && typeof error.lineNumber == 'number') {
                    errorBuilder += `Line : ${error.lineNumber}  ${errorTab}`
                }



                if (typeof error.request !== 'undefined' && typeof error.request == 'object') {

                    if (typeof error.request.method !== 'undefined' && typeof error.request.method == 'string') {
                        errorBuilder += `Method : ${error.request.method}  ${errorTab}`
                    }

                    if (typeof error.request.path !== 'undefined' && typeof error.request.path == 'string') {
                        errorBuilder += `Path : ${error.request.path}  ${errorTab}`
                    }


                }

                if (typeof error.stack !== 'undefined' && typeof error.stack == 'string') {
                    //console.log(`${colours.fg.yellow} ${error.stack} ${colours.reset}|`)
                    errorBuilder += `${error.stack} ${errorTab}`
                }




                fs.exists(pathToWrite, function (exists) {
                    if (!exists) {
                        fs.openSync(pathToWrite, 'w');
                        fs.closeSync(fs.openSync(pathToWrite, 'w'));
                    }
                });

                fs.appendFile(pathToWrite, errorBuilder, (err) => {

                    if (err) {
                        console.error(`writeFile at ${pathToWrite} failed...`)
                        throw err;
                    }

                    console.log(colours.fg.green + 'Error writted' + colours.reset);
                });

            } else {
                console.log(` ${colours.fg.red} Missing error object in LogError ${colours.reset}`);
            }








        } else {
            console.error("Missing .env file, look at .env.exemple");
        }

    } else {
        console.error("Missing fs npm, try npm install");
    }



}

function getDate() {
    var now = new Date();
    date = `${AddZero(now.getDay())}-${AddZero(now.getMonth())}-${AddZero(now.getFullYear())}`
    time = `${AddZero(now.getHours())}:${AddZero(now.getMinutes())}`
    console.log(date)
    console.log(time)
}

function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

