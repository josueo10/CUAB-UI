import React from 'react';

// Displays Lists of Objects Detected, for both Local and Global Views

const style = {
    container: {
        display: 'flex',
        height: "100%",
        width: 250,
        border: '0px solid black',
        marginRight: "40px",
        marginLeft: "40px",
        marginTop: "40px",
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: "5px"

    },
    items: {
        width: 250,
        height: 85,
        border: '1px solid black',
    },
    title: {
        width: 250,
        height: 50,
        border: '1px solid black',
    }

}

const ObjectList = ({ title, object }) => {
    return (
        <div style={style.container}>
            <div style={style.title}>
                <h2>{title}:</h2>
            </div>
            {object.map(({ classname, x, y, z }, index) => (
                <div style={style.items}>
                    <h2>{classname}:<br /> ({x}, {y}, {z})</h2>
                </div>
            )
            )}
        </div>
    )
}

export default ObjectList