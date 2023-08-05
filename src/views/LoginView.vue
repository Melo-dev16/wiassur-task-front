<style>
@import '../assets/css/login.css';
</style>

<script setup>
import { onMounted } from 'vue'
import { getPersistUser, getUser } from '../services/user'

if (getUser() !== null) {
	window.location.href = "/"
}

let persistUser = getPersistUser()
var $toast = useToast({ position: 'top' });
if (persistUser !== null) {
	let data = {
		email: persistUser.email,
		token: persistUser.token
	}

	post('/auto_login', data).then((result) => {
		let data = result.data

		setUser(data)
		setPersistUser({ email: data.email, token: data.token })

		$toast.success(`Bienvenue ${data.lastname} ${data.firstname}`);

		setTimeout(() => {
			window.location.href = "/"
		}, 3500)
	})
}

onMounted(() => {
	const signUpButton = document.getElementById('signUp');
	const signInButton = document.getElementById('signIn');
	const container = document.getElementById('container');

	signUpButton.addEventListener('click', () => {
		container.classList.remove("right-panel-active");
	});

	signInButton.addEventListener('click', () => {
		container.classList.add("right-panel-active");
	});
})
</script>

<template>
	<h2>Bienvenue sur WiASSUR Task Manager</h2>
	<div class="container" id="container">
		<div class="form-container sign-up-container">
			<form @submit="signup($event)" action="#">
				<h1>Créez votre compte en 1 minute chrono !</h1>
				<input :disabled="loading" required v-model="signupData.lastname" type="text" placeholder="Nom" />
				<input :disabled="loading" required v-model="signupData.firstname" type="text" placeholder="Prénoms" />
				<input :disabled="loading" required v-model="signupData.email" type="email" placeholder="Adresse Email" />
				<input :disabled="loading" required v-model="signupData.password" type="password"
					placeholder="Mot de passe" />
				<input :disabled="loading" required v-model="signupData.confirm" type="password"
					placeholder="Confirmer le mot de passe" />
				<button :disabled="loading" type="submit">S'inscrire</button>
			</form>
		</div>
		<div class="form-container sign-in-container">
			<form @submit="login($event)" action="#">
				<h1>Connectez-vous pour continuer</h1>
				<input :disabled="loading" required v-model="loginData.email" type="email" placeholder="Adresse Email" />
				<input :disabled="loading" required v-model="loginData.password" type="password"
					placeholder="Mot de passe" />
				<a href="#">Mot de passe oublié ?</a>
				<button :disabled="loading" type="submit">Se Connecter</button>
			</form>
		</div>
		<div class="overlay-container">
			<div class="overlay">
				<div class="overlay-panel overlay-left">
					<h1>Bon retour !</h1>
					<p>Si vous avez déjà un compte, connectez vous ici !</p>
					<button class="ghost" id="signUp">Se Connecter</button>
				</div>
				<div class="overlay-panel overlay-right">
					<h1>Bienvenue !</h1>
					<p>Pas encore de compte ? Inscrivez vous ici !</p>
					<button class="ghost" id="signIn">S'inscrire</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import { post } from '../services/api'
import { setUser, setPersistUser } from '../services/user'

export default {
	data() {
		return {
			signupData: {
				email: '',
				password: '',
				confirm: '',
				lastname: '',
				firstname: ''
			},
			loginData: {
				email: '',
				password: ''
			},
			loading: false
		}
	},
	methods: {
		signup(ev) {
			ev.preventDefault()
			var $toast = useToast({ position: 'top' });

			let data = {
				email: this.signupData.email,
				password: this.signupData.password,
				confirm: this.signupData.confirm,
				lastname: this.signupData.lastname,
				firstname: this.signupData.firstname
			}

			if (data.confirm !== data.password) {
				$toast.error('Mot de passe non confirmé !');

				return;
			}

			this.loading = true
			post('/signup', data).then((result) => {
				let data = result.data
				console.log(data);

				setUser(data)
				setPersistUser({ email: data.email, token: data.token })

				$toast.success(`Bienvenue ${data.lastname} ${data.firstname}`);

				setTimeout(() => {
					window.location.href = "/"
				}, 3500)
				this.loading = false
			}).catch((err) => {
				console.log(err);

				let error = error.response.data ? error.response.data : 'Une erreur est survenue ! Veuillez réessayer !'
				$toast.error(error);
				this.loading = false
			});
		},
		login(ev) {
			ev.preventDefault()
			var $toast = useToast({ position: 'top' });

			let data = {
				email: this.signupData.email,
				password: this.signupData.password
			}

			this.loading = true
			post('/login', data).then((result) => {
				let data = result.data
				console.log(data);

				setUser(data)
				setPersistUser({ email: data.email, token: data.token })

				$toast.success(`Bienvenue ${data.lastname} ${data.firstname}`);

				setTimeout(() => {
					window.location.href = "/"
				}, 3500)
			}).catch((err) => {
				console.log(err);

				let error = 'Adresse email ou mot de passe incorrect !'
				$toast.error(error);
				this.loading = false
			});
		}
	}
}
</script>