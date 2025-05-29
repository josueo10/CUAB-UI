import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Label, Tag } from 'react-konva';

// Local Display - displays boat, boat label, buoys and bouy labels
// Canvas3 is now used instead of this one


const Canvas = ({ boatPosition, buoys, width, height, style }) => {
  const [hoveredBuoy, setHoveredBuoy] = useState(null);
  const boat_width = 60;
  const boat_height = 30;
  const buoy_radius = 12;
  return (
    <div style={style}>
      <Stage width={width} height={height} style={{ border: '1px solid black' }}>
        <Layer>
          <Rect
            x={boatPosition.x}
            y={boatPosition.y}
            width={boat_width}
            height={boat_height}
            fill="blue"
            rotation={90}
            offset={{
              x: boat_width / 2,
              y: boat_height / 2
            }}
            onMouseEnter={() => setHoveredBuoy({ x: boatPosition.x, y: boatPosition.y })}
            onMouseLeave={() => setHoveredBuoy(null)}
          />
          {hoveredBuoy && hoveredBuoy.x === boatPosition.x && hoveredBuoy.y === boatPosition.y && (
            <Label x={boatPosition.x} y={boatPosition.y}>
              <Tag
                fill="white"
                pointerDirection="down"
                pointerWidth={10}
                pointerHeight={10}
                strokeWidth={1}
                stroke="black"
              />
              <Text
                text={`X: ${width / 2 - hoveredBuoy.x}, Y: ${height - hoveredBuoy.y}`}
                fontSize={15}
                padding={5}
                fill={"black"}
              />
            </Label>
          )}
        </Layer>
        <Layer clearBeforeDraw={true}>
          {buoys.map(({ classname, x, y }, index) => (
            <React.Fragment key={index}>
              <Circle
                x={x}
                y={y}
                radius={buoy_radius}
                fill={
                  classname === "red-buoy" || classname === "red-column-buoy"
                    ? "red"
                    : classname === "blue-buoy"
                      ? "blue"
                      : classname === "green-buoy" || classname === "green-column-buoy"
                        ? "green"
                        : classname === "yellow-buoy"
                          ? "yellow"
                          : classname === "black-buoy" ? "black" : "grey"
                }
                stroke={classname === "green-column-buoy" || classname === "red-column-buoy" ? "black" : "transparent"}
                strokeWidth={classname === "green-column-buoy" || classname === "red-column-buoy" ? 2 : 0}
                onMouseEnter={() => setHoveredBuoy({ classname, x, y })}
                onMouseLeave={() => setHoveredBuoy(null)}
              />
              {hoveredBuoy && hoveredBuoy.x === x && hoveredBuoy.y === y && (
                <Label x={x} y={y}>
                  <Tag
                    fill="white"
                    pointerDirection="down"
                    pointerWidth={10}
                    pointerHeight={10}
                    strokeWidth={1}
                    stroke="black"
                  />
                  <Text
                    text={`Classname: ${classname} \nX: ${x - width / 2}, Y: ${height - y}`}
                    fontSize={15}
                    padding={5}
                    fill={"black"}
                  />
                </Label>
              )}
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;