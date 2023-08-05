<style>
@import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
@import '../assets/css/client.css';
</style>

<script setup>
import { getUser } from '../services/user'

if (getUser() === null) {
  window.location.href = "/connexion"
}

</script>

<template>
  <div class="container">
    <div class="kanban-heading">
      <strong class="kanban-heading-text">Kanban Board</strong>
      <button @click="logout" id="logout">Deconnexion</button>
    </div>
    <div v-if="isAdmin" class="add-form">
      <h3>Ajouter une tache</h3>
      <form @submit="addTask($event)" action="#">
        <p><input required v-model="taskData.title" type="text" placeholder="Titre de la tache"></p>
        <p><textarea required v-model="taskData.desc" placeholder="Description" cols="30" rows="10"></textarea></p>
        <p>
          <label>Attribué à</label>
          <select required v-model="taskData.user">
            <option v-for="u in users" :value="u.id">{{ u.lastname }} {{ u.firstname }}</option>
          </select>
        </p>
        <p>
          <button type="submit">Ajouter</button>
        </p>
      </form>
    </div>
    <div class="kanban-board">
      <div class="kanban-block" id="todo">
        <strong>A faire</strong>
        <div v-for="t in todo" @click="toggleShow($event)" class="task">
          <span>{{ t.title }}</span>
          <div class="desc">
            <p>{{ t.description }}</p>
            <div>{{ t.user.lastname }} {{ t.user.firstname }}</div>
          </div>
        </div>
      </div>
      <div class="kanban-block" id="inprogress">
        <strong>En cours</strong>
        <div v-for="t in progress" @click="toggleShow($event)" class="task">
          <span>{{ t.title }}</span>
          <div class="desc">
            <p>{{ t.description }}</p>
            <div>{{ t.user.lastname }} {{ t.user.firstname }}</div>
          </div>
        </div>
      </div>
      <div class="kanban-block" id="done">
        <strong>Fini</strong>
        <div v-for="t in done" @click="toggleShow($event)" class="task">
          <span>{{ t.title }}</span>
          <div class="desc">
            <p>{{ t.description }}</p>
            <div>{{ t.user.lastname }} {{ t.user.firstname }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import { post, get } from '../services/api'
import { removeUser, removePersistUser } from '../services/user'

export default {
  data() {
    return {
      taskData: {
        title: '',
        desc: '',
        user: ''
      },
      loading: false,
      users: [],
      tasks: [],
      todo: [],
      progress: [],
      done: [],
      isAdmin: false
    }
  },
  methods: {
    toggleShow(ev) {
      let target = ev.target

      if (target.classList.contains('show-more')) {
        target.classList.remove('show-more')
      }
      else {
        target.classList.add('show-more')
      }
    },
    addTask(ev) {
      ev.preventDefault()
      var $toast = useToast({ position: 'top' });

      let data = {
        title: this.taskData.title,
        description: this.taskData.desc,
        user: "/api/users/" + this.taskData.user
      }

      this.loading = true
      post('/api/tasks', data).then((result) => {
        let data = result.data
        console.log(data);

        $toast.success(`Tache ajouté`);
        this.loading = false

        this.taskData.title = ''
        this.taskData.desc = ''
        this.taskData.user = ''

        this.todo.push(result.data)
      }).catch((err) => {
        console.log(err);

        let error = error.response.data ? error.response.data : 'Une erreur est survenue ! Veuillez réessayer !'
        $toast.error(error);
        this.loading = false
      });
    },
    async fetchData() {
      get('/api/users').then((result) => {
        this.users = result.data
        console.log(this.users);
      })

      const user = getUser()

      if (user !== null) {
        get('/api/tasks?user.id=' + user.id).then((result) => {
          this.tasks = result.data
          console.log(this.tasks);
          this.tasks.forEach((t) => {
            if (t.status === 'to_do') {
              this.todo.push(t)
            }

            if (t.status === 'in_progress') {
              this.progress.push(t)
            }

            if (t.status === 'done') {
              this.done.push(t)
            }
          })
        })
      }
      else {
        get('/api/tasks').then((result) => {
          this.tasks = result.data

          this.tasks.forEach((t) => {
            if (t.status === 'to_do') {
              this.todo.push(t)
            }

            if (t.status === 'in_progress') {
              this.progress.push(t)
            }

            if (t.status === 'done') {
              this.done.push(t)
            }
          })
        })
      }
    },
    logout() {
      removeUser()
      removePersistUser()

      window.location.href = "/connexion"
    }
  },
  mounted() {
    const user = getUser()

    this.fetchData()

    this.isAdmin = user.roles.includes('ROLE_ADMIN')
  }
}
</script>