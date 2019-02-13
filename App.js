import React from 'react'
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	TextInput,
	Keyboard,
	Animated,
} from 'react-native'

export default class App extends React.Component {
	constructor() {
		super()

		this.state = {
			isLogin: true,
			showLogin: true,
			showSignup: false,
		}

		this._animatedRotationValue = new Animated.Value(0)
		this._keyboardHeight = new Animated.Value(0)

		this._angleValue = 0
		this._bottomValue = 0
	}

	componentWillMount() {
		this._animatedRotationValue.addListener(({ value }) => {
			this._angleValue = value
		})
		this.frontInterpolate = this._animatedRotationValue.interpolate({
			inputRange: [0, 180],
			outputRange: ['0deg', '180deg'],
		})
		this.backInterpolate = this._animatedRotationValue.interpolate({
			inputRange: [0, 180],
			outputRange: ['180deg', '360deg'],
		})
		this.frontOpacity = this._animatedRotationValue.interpolate({
			inputRange: [89, 90],
			outputRange: [1, 0],
		})
		this.backOpacity = this._animatedRotationValue.interpolate({
			inputRange: [89, 90],
			outputRange: [0, 1],
		})
	}

	componentDidMount() {
		this._keyboardDidShowSub = Keyboard.addListener(
			'keyboardDidShow',
			event => {
				let offset = 0
				if (this._bottomValue > event.endCoordinates.screenY) {
					offset = this._bottomValue - event.endCoordinates.screenY + 20
				}

				Animated.timing(this._keyboardHeight, {
					toValue: -offset,
					duration: 300,
				}).start()
			}
		)

		this._keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', () => {
			Animated.timing(this._keyboardHeight, {
				toValue: 0,
				duration: 300,
			}).start()
		})
	}

	componentWillUnmount() {
		this._keyboardDidShowSub.remove()
		this._keyboardDidHideSub.remove()
	}

	_onPressLogin = () => {
		if (!this.state.isLogin) {
			Keyboard.dismiss()
			this.setState({ isLogin: true, showLogin: true })
			this._flipView()
		}
	}

	_onPresssignup = () => {
		if (this.state.isLogin) {
			Keyboard.dismiss()
			this.setState({ isLogin: false, showSignup: true })
			this._flipView()
		}
	}

	_flipView() {
		if (this._angleValue >= 90) {
			Animated.spring(this._animatedRotationValue, {
				toValue: 0,
				friction: 8,
				tension: 10,
			}).start(() => this.setState({ showSignup: false }))
		} else {
			Animated.spring(this._animatedRotationValue, {
				toValue: 180,
				friction: 8,
				tension: 10,
			}).start(() => this.setState({ showLogin: false }))
		}
	}

	_renderSwitcher() {
		return (
			<View style={styles.switcherContainer}>
				<TouchableOpacity
					style={[
						styles.switcherButton,
						this.state.isLogin
							? { backgroundColor: '#3CB371' }
							: { backgroundColor: '#808080' },
					]}
					onPress={this._onPressLogin}
				>
					<Text
						style={[
							styles.switcherButtonText,
							this.state.isLogin ? { color: '#FFF' } : { color: '#A9A9A9' },
						]}
					>
						Log In
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.switcherButton,
						this.state.isLogin
							? { backgroundColor: '#808080' }
							: { backgroundColor: '#3CB371' },
					]}
					onPress={this._onPresssignup}
				>
					<Text
						style={[
							styles.switcherButtonText,
							this.state.isLogin ? { color: '#A9A9A9' } : { color: '#FFF' },
						]}
					>
						Sign Up
					</Text>
				</TouchableOpacity>
			</View>
		)
	}

	_renderForm() {
		if (this.state.isLogin) {
			return (
				<View style={styles.formContainer} onLayout={this._onLayout}>
					<View style={styles.formLabelContainer}>
						<Text style={styles.formLabelText}>Welcome Back!</Text>
					</View>
					<View style={styles.formInputContainer}>
						<TextInput
							placeholder="Email Adress"
							style={styles.formInput}
							autoFocus={false}
						/>
					</View>
					<View style={styles.formInputContainer}>
						<TextInput
							placeholder="Password"
							style={styles.formInput}
							autoFocus={false}
						/>
					</View>
					<View style={{ paddingTop: 50 }}>
						<TouchableOpacity onPress={() => {}} style={styles.formButton}>
							<Text style={styles.formButtonText}>LOG IN</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		} else {
			return (
				<View style={styles.formContainer} onLayout={this._onLayout}>
					<View style={styles.formLabelContainer}>
						<Text style={styles.formLabelText}>Sign Up for Free</Text>
					</View>
					<View style={styles.formInputContainer}>
						<TextInput
							placeholder="First Name"
							style={styles.formInput}
							autoFocus={false}
						/>
					</View>
					<View style={styles.formInputContainer}>
						<TextInput
							placeholder="Last Name"
							style={styles.formInput}
							autoFocus={false}
						/>
					</View>
					<View style={styles.formInputContainer}>
						<TextInput
							placeholder="Email Adress"
							style={styles.formInput}
							autoFocus={false}
						/>
					</View>
					<View style={styles.formInputContainer}>
						<TextInput
							placeholder="Password"
							style={styles.formInput}
							autoFocus={false}
						/>
					</View>
					<View style={{ paddingTop: 50 }}>
						<TouchableOpacity onPress={() => {}} style={styles.formButton}>
							<Text style={styles.formButtonText}>JOIN US</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		}
	}

	_onLayout = event => {
		this._bottomValue =
			event.nativeEvent.layout.y + event.nativeEvent.layout.height
	}

	render() {
		const frontAnimatedStyle = {
			transform: [
				{ rotateY: this.frontInterpolate },
				{ translateY: this._keyboardHeight },
			],
		}

		const backAnimatedStyle = {
			transform: [
				{ rotateY: this.backInterpolate },
				{ translateY: this._keyboardHeight },
			],
		}

		return (
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={{ flex: 1 }}>
					{(this.state.isLogin || this.state.showLogin) && (
						<Animated.View
							style={[
								styles.container,
								frontAnimatedStyle,
								{ opacity: this.frontOpacity },
							]}
						>
							{this._renderSwitcher()}
							{this._renderForm()}
						</Animated.View>
					)}

					{(!this.state.isLogin || this.state.showSignup) && (
						<Animated.View
							style={[
								styles.container,
								styles.containerBackside,
								backAnimatedStyle,
								{ opacity: this.backOpacity },
							]}
						>
							{this._renderSwitcher()}
							{this._renderForm()}
						</Animated.View>
					)}
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#13222C',
		paddingHorizontal: 20,
		paddingTop: 40,
		backfaceVisibility: 'hidden',
	},
	containerBackside: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	switcherContainer: {
		flexDirection: 'row',
	},
	switcherButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '50%',
		paddingVertical: 10,
	},
	switcherButtonText: {
		fontSize: 24,
	},
	formLabelContainer: {
		paddingVertical: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	formLabelText: {
		fontSize: 30,
		color: '#FFF',
	},
	formContainer: {
		width: '100%',
		justifyContent: 'space-evenly',
	},
	formInputContainer: {
		paddingVertical: 10,
	},
	formInput: {
		borderColor: '#FFF',
		borderWidth: 1,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	formButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		paddingVertical: 10,
		backgroundColor: '#3CB371',
	},
	formButtonText: {
		fontSize: 24,
		color: '#FFF',
	},
})
