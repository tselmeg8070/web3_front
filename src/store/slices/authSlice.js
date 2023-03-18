import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_TOKEN } from 'constants/AuthConstant';
import FirebaseService from 'services/FirebaseService';
import AuthService from 'services/AuthService';

export const initialState = {
	loading: false,
	message: '',
	successMessage: '',
	showMessage: false,
	signedUp: false,
	redirect: '',
	token: localStorage.getItem(AUTH_TOKEN) || null
}

/**
 * Response of login request:
 * {
 * 	token: "fjdsklajfka"
 * }
 */
export const signIn = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
	const { email, password } = data
	try {
		console.log("Data", data)
		const response = await AuthService.login({email, password})
		console.log("Data", response.token)
		const token = response.token;
		localStorage.setItem(AUTH_TOKEN, token);
		return token;
	} catch (err) {
		return rejectWithValue(err.response?.message || 'Error')
	}
})

/**
 * Response of signup request:
 * {
 * 	token: "fjdsklajfka"
 * }
 */
export const signUp = createAsyncThunk('auth/register',async (data, { rejectWithValue }) => {
	const { email, password } = data
	try {
		const response = await AuthService.register({email, password})
		console.log(response.data);
		return "ok";
	} catch (err) {
		return rejectWithValue(err.response?.data?.message || 'Error')
	}
})

export const signOut = createAsyncThunk('auth/logout',async () => {
	localStorage.removeItem(AUTH_TOKEN);
    return "success"
})


export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authenticated: (state, action) => {
			state.loading = false
			state.redirect = '/'
			state.token = action.payload
		},
		showAuthMessage: (state, action) => {
			state.message = action.payload
			state.showMessage = true
			state.loading = false
		},
		hideAuthMessage: (state) => {
			state.showMessage = false
			state.message = ''
			state.successMessage = ''
		},
		signOutSuccess: (state) => {
			state.loading = false
			state.token = null
			state.redirect = '/'
		},
		showLoading: (state) => {
			state.loading = true
		},
		signInSuccess: (state, action) => {
			state.loading = false
			state.token = action.payload
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(signIn.pending, (state) => {
				state.loading = true
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signIn.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(signOut.fulfilled, (state) => {
				state.loading = false
				state.token = null
				state.redirect = '/'
			})
			.addCase(signOut.rejected, (state) => {
				state.loading = false
				state.token = null
				state.redirect = '/'
			})
			.addCase(signUp.pending, (state) => {
				state.loading = true
			})
			.addCase(signUp.fulfilled, (state) => {
				state.successMessage = "Signed up successfully :)"
				state.showMessage = true
				state.loading = false
				state.redirect = '/login'
				state.signedUp = true
			})
			.addCase(signUp.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
	},
})

export const {
	authenticated,
	showAuthMessage,
	hideAuthMessage,
	signOutSuccess,
	showLoading,
	signInSuccess
} = authSlice.actions

export default authSlice.reducer
