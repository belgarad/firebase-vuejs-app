<template>
  <v-app>

      <v-toolbar fixed>
      <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click.stop="sidebar = !sidebar">
        </v-toolbar-side-icon>
      </span>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          {{ appTitle }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.path">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn  v-if="isAuthenticated" flat @click="userSignOut">
          <v-icon left>exit_to_app</v-icon>
          Sign Out
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>

  </v-app>
</template>

<script>
export default {
	data() {
		return {
			// appTitle: 'Awesome App',
			sidebar: false,
			menuItems() {
				if (this.isAuthenticated) {
					return [{ title: 'Home', path: '/home', icon: 'home' }];
				} else {
					return [
						{ title: 'Sign Up', path: '/signup', icon: 'face' },
						{ title: 'Sign In', path: '/signin', icon: 'lock_open' },
					];
				}
			},
		};
	},
	computed: {
		appTitle() {
			return this.$store.getters.appTitle;
		},
		isAuthenticated() {
			return this.$store.getters.getUser !== null && this.$store.getters.getUser !== undefined;
		},
	},
	methods: {
		userSignOut() {
			this.$store.dispatch('userSignOut');
		},
	},
};
</script>

<style lang="stylus">
@import './stylus/main';
</style>