import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Circle, Text, Label, Tag, Arrow, Image } from 'react-konva';

const Canvas3 = ({ boatPosition, buoys, waypoints, width, height, style, local, boatImageSrc }) => {
  const [hoveredBuoy, setHoveredBuoy] = useState(null);
  const [boatImage, setBoatImage] = useState(null);

  const boat_width = local ? 30 : 10;
  const boat_height = local ? 60 : 20;
  const rotation = local ? 90 : 180 - boatPosition.theta;
  const waypoint_radius = 3;
  const buoy_radius = local ? 12 : 5;

  // Load boat image
  useEffect(() => {
    const image = new window.Image();
    image.src = boatImageSrc; // Pass the image source as a prop
    image.onload = () => {
      setBoatImage(image);
    };
  }, [boatImageSrc]);

  return (
    <div style={style}>
      <Stage width={width} height={height} style={{ border: '1px solid black' }}>
        <Layer clearBeforeDraw={!local}>
          {boatImage && (
            <Image
              image={boatImage}
              x={boatPosition.x}
              y={boatPosition.y}
              width={boat_width}
              height={boat_height}
              offset={{
                x: boat_width / 2,
                y: boat_height / 2
              }}
              rotation={rotation + 90}
            />
          )}
          {/* <Arrow
            x={boatPosition.x}
            y={boatPosition.y}
            points={[boat_width / 2, boat_height / 2, 0, boat_height / 2]}
            pointerLength={5}
            pointerWidth={5}
            fill="red"
            stroke="red"
            strokeWidth={2}
            offset={{
              x: boat_width / 2,
              y: boat_height / 2
            }}
            rotation={rotation}
          /> */}
        </Layer>

        <Layer clearBeforeDraw={true}>
          {waypoints.map(({ x, y }, index) => (
            <React.Fragment key={index}>
              <Circle
                x={x}
                y={y}
                radius={waypoint_radius}
                fill="orange"
                onMouseEnter={() => setHoveredBuoy({ x, y })}
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
                    text={`X: ${x - width / 2}, Y: ${height - y}`}
                    fontSize={15}
                    padding={5}
                    fill={"black"}
                  />
                </Label>
              )}
            </React.Fragment>
          ))}
        </Layer>

        <Layer clearBeforeDraw={true}>
          {buoys.map(({ classname, x, y }, index) => (
            <React.Fragment key={index}>
              <Circle
                x={x}
                y={y}
                radius={buoy_radius}
                fill={
                  classname === "red-buoy" || classname === "red-column-buoy" || classname === "red-dot"
                    ? "red"
                    : classname === "blue-buoy" || classname === "blue-cross"
                      ? "blue"
                      : classname === "green-buoy" || classname === "green-column-buoy"
                        ? "green"
                        : classname === "yellow-buoy" || classname === "yellow-duck"
                          ? "yellow"
                          : classname === "black-buoy"
                            ? "black"
                            : "grey"

                }
                stroke={classname === "green-column-buoy" || classname === "red-column-buoy" ? "black" : "transparent"}
                strokeWidth={classname === "green-column-buoy" || classname === "red-column-buoy" ? 1 : 0}
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
                    text={`Classname: ${classname} \nX: ${x}, Y: ${y}`}
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

export default Canvas3;
