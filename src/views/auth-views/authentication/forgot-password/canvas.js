import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Stage, Container, Sprite, Text, useTick } from '@pixi/react';

const reducer = (_, { data }) => data;
const height = 576;
const width = 300;

const Bunny = ({ speed, options, image }) => {
    const [motion, update] = useReducer(reducer, { ...options, anchor: 0.5 });
    const iter = useRef(0);

    useTick((delta) => {
        const i = (iter.current += 0.05 * delta);
        update({
            type: 'update',
            data: {
                x: motion.x + speed.x,
                y: motion.y + speed.y,
                anchor: 0.5,
            },
        });
    });

    return <Sprite
        image={image} {...motion} />;
};

const Gate = ({ keyPoint, options, image, id }) => {
    const [motion, update] = useReducer(reducer, { ...options, anchor: 0.5 });
    const iter = useRef(0);
    const [bunnies, setBunnies] = useState([]);

    useTick((delta) => {
        if (Math.round(iter.current) < Math.round(iter.current + 0.05 * delta))
        {
            if (keyPoint === id)
            {
                setBunnies((val) => [...val, 1]);
            }
        }
        const i = (iter.current += 0.05 * delta);
        update({
            type: 'update',
            data: {
                x: motion.x,
                y: motion.y,
            },
        });
    });

    return <>
        {bunnies.length > 0 && bunnies.map(child => 
            <Bunny speed={{ x: 0, y: -5 }} options={{ x: options.x, y: height, height: 40, width: 20 }}
                image={"https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"} />
        )}
        <Sprite
            image={image} {...motion} />
    </>
};

const Canvas = ({keyPoint}) => {
    const [gateLeft, setGateLeft] = useState([]);
    const [gateTop, setGateTop] = useState([]);
    const [gateRight, setGateRight] = useState([]);

    const interval = useRef();
    
    // const intervalRef = useRef();
    // intervalRef.current = keyPoint;

    // useEffect(() => {
    //     const id = setInterval(() => {
    //         if (intervalRef.current)
    //         {
    //             if (intervalRef.current === 1)
    //                 setGateLeft([...gateLeft, 1]);
    //         }
    //       }, 500);
    //       intervalRef.current = keyPoint;
    //       return () => {
    //         clearInterval(id);
    //       };
    // }, []);

    return (
        <Stage width={width} height={height} options={{ backgroundAlpha: 0.5 }}>
            
            <Gate
                id={1}
                keyPoint={keyPoint}
                options={{ x: 50, y: height , height: 40, width: 100 }} 
                image={"https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"} />
            <Gate
                id={2}
                keyPoint={keyPoint}
                options={{ x: 150, y: height , height: 40, width: 100 }} 
                image={"https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"} />
            {/* <Bunny speed={{ x: 0, y: 0 }} options={{ x: 150, y: height , height: 40, width: 100 }} image={"https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"} /> */}
            {gateRight.length > 0 && gateRight.map(child => 
                <Bunny speed={{ x: 0, y: -5 }} options={{ x: 50, y: height, height: 40, width: 20 }}
                    image={"https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"} />
            )}
            <Gate
                id={3}
                keyPoint={keyPoint}
                options={{ x: 250, y: height , height: 40, width: 100 }} 
                image={"https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"} />
        </Stage>
    )
}
export default Canvas;