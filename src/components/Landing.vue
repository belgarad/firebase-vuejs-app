<template>
	<v-layout>
		<v-layout column>
			<v-flex xs12 class="text-xs-center" mt-5>
				<h3>Welcome to Awesome App</h3>
			</v-flex>
			<v-flex xs12 sm6 offset-sm3 mt-3>
				<blockquote>
					It's a basics application with authentication, real-time database and hosted on Google Firebase hosting
				</blockquote>
			</v-flex>
			<v-flex class="text-xs-center" mt-5>
				<v-btn primary to="/signup">Sign Up</v-btn>
				<v-btn to="/signin">Sign In</v-btn>
			</v-flex>
		</v-layout>
		<v-layout row wrap>
			<v-flex md6>
				<blockquote>
					Login With SmS
				</blockquote>
			</v-flex>
			<v-flex md6 v-if="!showCodeInput">
				<v-text-field label="Phone Number" v-model="number"></v-text-field>
				<v-btn info @click="sendSMS" id="get-sign-in-code" :disabled="number === ''" v-text="getSignInCodeButton.text"></v-btn>
			</v-flex>
			<v-flex md6 v-if="showCodeInput">
				<v-text-field v-model="confirmCode" label="Verification Code"></v-text-field>
				<v-btn info @click="signIn" :disabled="confirmCode.length !== 6 " v-text="signInButton.text"></v-btn>
			</v-flex>
		</v-layout>
	</v-layout>
</template>

<script>
import firebase from 'firebase';
export default {
	name: 'landing',
	data: () => ({
		showNumberInput: true,
		showCodeInput: false,
		number: '',
		confirmCode: '',
		// Buttons
		getSignInCodeButton: {
			text: 'Get sign in code',
		},
		signInButton: {
			text: 'Sign in',
		},
	}),
	mounted() {
		const self = this;

		// Start Firebase invisible reCAPTCHA verifier
		window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('get-sign-in-code', {
			size: 'invisible',
			callback: () => {
				// reCAPTCHA solved, allow signInWithPhoneNumber.
				self.sendSMS();
			},
		});

		window.recaptchaVerifier.render().then(widgetId => {
			window.recaptchaWidgetId = widgetId;
		});
	},
	methods: {
		/**
		 * Sends the user an SMS-verification code using Firebase auth
		 *
		 * @see https://firebase.google.com/docs/auth/web/phone-auth
		 */
		sendSMS() {
			const self = this;

			self.getSignInCodeButton = {
				showSpinner: true,
				text: 'Sending SMS..',
				disabled: true,
			};

			var appVerifier = window.recaptchaVerifier;
			firebase
				.auth()
				.signInWithPhoneNumber(this.number, appVerifier)
				.then(
					function(confirmationResult) {
						// SMS sent. Prompt user to type the code from the message, then sign the
						// user in with confirmationResult.confirm(code).
						console.log(JSON.stringify(confirmationResult));
						window.confirmationResult = confirmationResult;
						this.showCodeInput = !this.showCodeInput;
					}.bind(this)
				)
				.catch(function(error) {
					grecaptcha.reset(window.recaptchaWidgetId);
					// Error; SMS not sent
					// ...
				});
		},

		/**
		 * Authenticates the user with Firebase auth
		 */
		signIn() {
			// Redirect the user to the authenticated page
			confirmationResult
				.confirm(this.confirmCode)
				.then(
					function(result) {
						// User signed in successfully.
						console.log('confirmationResult success');
						var user = result.user;
						this.$store.dispatch('setUser', result.user);
						// ...
					}.bind(this)
				)
				.catch(function(error) {
					console.log('confirmationResult error ' + error);
					// User couldn't sign in (bad verification code?)
					// ...
				});
		},
	},
};
</script>
