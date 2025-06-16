radio.setGroup(124)
radio.setFrequencyBand(52)


type IRC = {
    l: DigitalPin,
    c: DigitalPin,
    r: DigitalPin
}
const IR: IRC = {
    l: DigitalPin.P14,
    c: DigitalPin.P15,
    r: DigitalPin.P13
}


const normalSpeeds: any = {
    l: {speed1: 0, speed2: -255},
    r: {speed1: -255, speed2: 0},
    c: {speed1: -200, speed2: -100},
    turnL: {speed1: 200, speed2: -150},
    turnR: {speed1: -200, speed2: 150}
}




pins.setPull(IR.l, PinPullMode.PullNone);
pins.setPull(IR.c, PinPullMode.PullNone);
pins.setPull(IR.r, PinPullMode.PullNone);


function setSpeed(speed1: number, speed2: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, speed1)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, speed2)
}
let turn = "C"



function turnFunc() {
    setSpeed(0,0)
    basic.pause(1000)
    setSpeed(-150,-75)
    basic.pause(100)
    setSpeed(turn == "L" ? normalSpeeds.turnL.speed1 : normalSpeeds.turnR.speed1, turn == "L" ? normalSpeeds.turnL.speed2 : normalSpeeds.turnR.speed2)
    basic.pause(300)
    turn = "C"
}


let pinInfo = {c:0, l:0, r:0}
basic.forever(function() {
    pinInfo = { c: pins.digitalReadPin(IR.c), l: pins.digitalReadPin(IR.l), r:pins.digitalReadPin(IR.r)}
    if ((pinInfo.c || pinInfo.r || pinInfo.l) && turn != "C") {
        turnFunc()
    } else {
        if (pinInfo.c && !pinInfo.l && !pinInfo.r) {
            setSpeed(normalSpeeds.c.speed1, normalSpeeds.c.speed2)
        } else if (pinInfo.l) {
            setSpeed(normalSpeeds.l.speed1, normalSpeeds.l.speed2)
        } else if (pinInfo.r) {
            setSpeed(normalSpeeds.r.speed1, normalSpeeds.r.speed2)
        }
    }
})


radio.onReceivedString(function(recv) {
    turn=recv
})



