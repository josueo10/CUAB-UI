import React from 'react';

//Displays Dashboard: information on far right side of UI
//Not used anymore

const style = {
    container: {
        display: 'flex',
        height: "100%",
        width: 250,
        border: '0px solid black',
        paddingRight: '20px',
        marginRight: "40px",
        marginLeft: "40px",
        marginTop: "40px",
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: "5px"
    },
    items: {
        width: 250,
        height: 50,
        border: '1px solid black',
    }
}

const Dashboard = ({ temperature, task, autonomous, alive, leak, sR, sL, velocity, angvelocity, orientation, x, y }) => {
    return (
        <div style={style.container}>
            <div style={style.items}>
                <h2>Pos: ({x}, {y})</h2>
            </div>
            <div style={style.items}>
                <h2>Velocity: {velocity}</h2>
            </div>
            <div style={style.items}>
                <h2>Angular Velocity: {angvelocity}</h2>
            </div>
            <div style={style.items}>
                <h2>Temperature: {temperature}</h2>
            </div>
            <div style={style.items}>
                <h2>Task: {task}</h2>
            </div>
            <div style={style.items}>
                <h2>Auto: {autonomous}</h2>
            </div>
            <div style={style.items}>
                <h2>Alive: {alive}</h2>
            </div>
            <div style={style.items}>
                <h2>Leak: {leak}</h2>
            </div>
            <div style={style.items}>
                <h2>sR: {sR}</h2>
            </div>
            <div style={style.items}>
                <h2>sL: {sL}</h2>
            </div>
            <div style={style.items}>
                <h2>Orientation: {orientation}</h2>
            </div>
        </div>
    )
}

export default Dashboard