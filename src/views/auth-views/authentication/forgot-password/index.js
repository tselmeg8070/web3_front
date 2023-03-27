import React, { useState } from 'react'
import { Card, Row, Col, Form, Input, Button, message } from "antd";
import { MailOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Canvas from './canvas';
import PoseNet from './pose-net';
// import MetalDrum from './metal-drum';

const backgroundStyle = {
	backgroundImage: 'url(/img/others/img-17.jpg)',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover'
}

const ForgotPassword = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [keyPoint, setKeyPoint] = useState(null);
	const [instrument, setInstrument] = useState("");
    const [lastHeadPosition, setLastHeadPosition] = useState(null);


	const theme = useSelector(state => state.theme.currentTheme)

	const getKeyPoints = (keypoints) => {
		const leftWrist = keypoints.find(kp => kp.part === "leftWrist");
		const rightWrist = keypoints.find(kp => kp.part === "rightWrist");
		const leftShoulder = keypoints.find(kp => kp.part === "leftShoulder");
		const rightShoulder = keypoints.find(kp => kp.part === "rightShoulder");

		const isPlayingGuitar =
			leftWrist.score > 0.5 &&
			rightWrist.score > 0.5 &&
			leftShoulder.score > 0.5 &&
			rightShoulder.score > 0.5 &&
			leftWrist.position.y < leftShoulder.position.y &&
			rightWrist.position.y < rightShoulder.position.y;

		// Detect drum playing
		const leftElbow = keypoints.find(kp => kp.part === "leftElbow");
		const rightElbow = keypoints.find(kp => kp.part === "rightElbow");
		const leftHip = keypoints.find(kp => kp.part === "leftHip");
		const rightHip = keypoints.find(kp => kp.part === "rightHip");

		const isPlayingDrums =
			leftElbow.score > 0.5 &&
			rightElbow.score > 0.5 &&
			leftHip.score > 0.5 &&
			rightHip.score > 0.5 &&
			leftElbow.position.y < leftHip.position.y &&
			rightElbow.position.y < rightHip.position.y;

		if (isPlayingGuitar) {
			console.log("Playing guitar")
			setInstrument("guitar");
		} else if (isPlayingDrums) {
			console.log("Playing drum")
			setInstrument("drums");
		} else {
			setInstrument("");
		}
		//Headbang
		if (
			keypoints &&
			lastHeadPosition &&
			Math.abs(keypoints[0].position.y - lastHeadPosition) > 30
		) {
			console.log('Headbang detected!');
		}
		if (keypoints) {
			setLastHeadPosition(keypoints[0].position.y);
		}
		//Position
		const point = keypoints.find(e => e.part === 'nose');
		if (point.position.x < 33)
			setKeyPoint(3);
		else if (point.position.x > 66)
			setKeyPoint(1);
		else
			setKeyPoint(2);
	}

	return (
		<div className="h-100" style={backgroundStyle}>
			<div className="container">
				{/* <MetalDrum price={keyPoint}/> */}
				<Canvas keyPoint={keyPoint} />
				<PoseNet getKeyPoints={getKeyPoints} />
			</div>
		</div>
	)
}

export default ForgotPassword

