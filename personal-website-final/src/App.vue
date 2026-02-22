<script setup>
import { ref, onMounted } from 'vue'

const comments = ref([])
const newName = ref('')
const newMessage = ref('')

// REST API GET Call
const fetchComments = async () => {
  const response = await fetch('/api/guestbook')
  comments.value = await response.json()
}

// REST API POST Call
const submitComment = async () => {
  await fetch('/api/guestbook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName.value, message: newMessage.value })
  })
  newName.value = ''
  newMessage.value = ''
  fetchComments() // Refresh the list
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <main style="max-width: 600px; margin: 40px auto; font-family: sans-serif;">
    <h1>TimoTeo's Final Project</h1>
    
    <form @submit.prevent="submitComment" style="margin-bottom: 20px;">
      <input v-model="newName" placeholder="Your Name" required style="display: block; margin-bottom: 10px; width: 100%; padding: 8px;" />
      <textarea v-model="newMessage" placeholder="Leave a message" required style="display: block; margin-bottom: 10px; width: 100%; padding: 8px;"></textarea>
      <button type="submit" style="padding: 10px 20px; background: blue; color: white; border: none; cursor: pointer;">Post Comment</button>
    </form>

    <div v-for="comment in comments" :key="comment.id" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
      <strong>{{ comment.name }}</strong>
      <p>{{ comment.message }}</p>
    </div>
  </main>
</template>