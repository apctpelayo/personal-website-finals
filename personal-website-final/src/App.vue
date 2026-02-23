<script setup>
import { ref, onMounted, watch, computed } from 'vue'

// --- DATABASE LOGIC ---
const comments = ref([])
const newName = ref('')
const newMessage = ref('')

const fetchComments = async () => {
  try {
    const response = await fetch('/api/guestbook')
    comments.value = await response.json()
  } catch (error) {
    console.error("Error fetching comments:", error)
  }
}

const submitComment = async () => {
  try {
    await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.value, message: newMessage.value })
    })
    newName.value = ''
    newMessage.value = ''
    fetchComments()
    currentPage.value = 1 // Jumps back to page 1 to see the new comment!
  } catch (error) {
    console.error("Error submitting comment:", error)
  }
}

// --- PAGINATION & DATE LOGIC ---
const currentPage = ref(1)
const commentsPerPage = 5

const paginatedComments = computed(() => {
    const start = (currentPage.value - 1) * commentsPerPage
    const end = start + commentsPerPage
    return comments.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(comments.value.length / commentsPerPage) || 1
})

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

// Makes the raw database timestamp look pretty (e.g., "Feb 24, 2026, 10:30 AM")
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// --- MOBILE MENU & MODAL LOGIC ---
const isMenuOpen = ref(false)
const showResources = ref(false) 

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

watch(showResources, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// --- SCROLL SPY & SCROLL ANIMATION LOGIC ---
onMounted(() => {
  fetchComments();

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section-spy');
  const observerOptions = { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 };
  
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              navLinks.forEach(link => link.classList.remove('active'));
              const id = entry.target.getAttribute('id');
              const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
              if (activeLink) activeLink.classList.add('active');
          }
      });
  }, observerOptions);
  
  sections.forEach(section => { if (section) observer.observe(section); });

  const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.style.animation = 'popUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.15 });

  const elementsToReveal = document.querySelectorAll('.section-header, .list-item, .brand-list span, .gallery-item');
  elementsToReveal.forEach(el => revealObserver.observe(el));
});
</script>

<template>
  <div class="main-layout">
        
        <aside class="sidebar-nav">
            <div class="mobile-header">
                <button class="menu-toggle" @click="toggleMenu">☰</button>
            </div>

            <nav class="nav-links" :class="{ 'open': isMenuOpen }">
                <a href="#about" class="nav-link active" @click="isMenuOpen = false">About Me</a>
                <a href="#education" class="nav-link" @click="isMenuOpen = false">Education</a>
                <a href="#skills" class="nav-link" @click="isMenuOpen = false">IT Experience</a>
                <a href="#hobbies" class="nav-link" @click="isMenuOpen = false">Hobbies</a>
                <a href="#goals" class="nav-link" @click="isMenuOpen = false">Goals</a>
                <a href="#gallery" class="nav-link" @click="isMenuOpen = false">Gallery</a>
                <a href="#guestbook" class="nav-link" @click="isMenuOpen = false">Guestbook</a>
                <a href="#contact" class="nav-link" @click="isMenuOpen = false">Contact</a>
                <a href="#" class="nav-link" @click.prevent="showResources = true; isMenuOpen = false">Resources</a>
            </nav>
        </aside>

        <main class="content-area">
            
            <div class="hero section-spy" id="about">
                    <h1>hey, my name is Timoteo Pelayo</h1>
    
                    <img src="/Image.jpg" alt="Profile Picture" class="profile-pic">
    
                    <h1>I am a 2nd year student at Asia Pacific College.</h1>
                </div>

            <section id="education" class="section-spy">
                <h2 class="section-header">Education & Achievements</h2>
                <div class="list-item">
                    <div class="item-title">Bachelor of Science in Information Technology</div>
                    <span class="item-subtitle">Current Course in Asia Pacific College</span>
                </div>
                <div class="list-item">
                    <div class="item-title">Best in Computer Programming 4</div>
                    <span class="item-subtitle">Academic Achievement in Senior High School</span>
                </div>
                <div class="list-item">
                    <div class="item-title">2nd Place Web Design Competition</div>
                    <span class="item-subtitle">Hosted by JPCS</span>
                </div>
            </section>

            <section id="skills" class="section-spy">
                <h2 class="section-header">IT Experience</h2>
                <div class="list-item">
                    <div class="item-title">Programming Languages</div>
                    <span class="item-subtitle">Basic Coding in Python & Java</span>
                </div>
                <div class="list-item">
                    <div class="item-title">Web Development</div>
                    <span class="item-subtitle">Basic HTML & CSS</span>
                </div>
            </section>

            <section id="hobbies" class="section-spy">
                <h2 class="section-header">Hobbies & Interests</h2>
                <div class="brand-list">
                    <span>Photography</span>
                    <span>Video Games</span>
                    <span>Watching Films</span>
                </div>
            </section>

            <section id="goals" class="section-spy">
                <h2 class="section-header">Goals in Life</h2>
                <div class="list-item">
                    <div class="item-title">Game Development</div>
                    <span class="item-subtitle">One of my dreams is to make my own game.</span>
                </div>
            </section>

            <section id="gallery" class="section-spy">
                <h2 class="section-header">Picture Gallery</h2> 
                <div class="gallery-grid">
                    <div class="gallery-item"><img src="/DSC_6509.JPG" alt="Gallery Image 1"></div>
                    <div class="gallery-item"><img src="/DSC_6535.JPG" alt="Gallery Image 2"></div>
                    <div class="gallery-item"><img src="/DSC_6539.JPG" alt="Gallery Image 3"></div>
                    <div class="gallery-item"><img src="/DSC_6552.JPG" alt="Gallery Image 4"></div>
                    <div class="gallery-item"><img src="/DSC_6576.JPG" alt="Gallery Image 5"></div>
                    <div class="gallery-item"><img src="/DSC_6581.JPG" alt="Gallery Image 6"></div>
                </div>
            </section>

            <section id="guestbook" class="section-spy">
                <h2 class="section-header">Guestbook</h2>
                
                <div class="list-item">
                    <form @submit.prevent="submitComment" class="guestbook-form">
                        <input v-model="newName" placeholder="Your Name" required class="gb-input" />
                        <textarea v-model="newMessage" placeholder="Leave a message..." required class="gb-input"></textarea>
                        <button type="submit" class="gb-button">Post Comment</button>
                    </form>
                </div>

                <div class="list-item visible-comment" v-for="comment in paginatedComments" :key="comment.id">
                    <div class="comment-header">
                        <div class="item-title">{{ comment.name }}</div>
                        <div class="comment-date">{{ formatDate(comment.created_at) }}</div>
                    </div>
                    <span class="item-subtitle">{{ comment.message }}</span>
                </div>

                <div class="pagination-controls" v-if="comments.length > 5">
                    <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">Previous</button>
                    <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
                    <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">Next</button>
                </div>
            </section>

            <section id="contact" class="section-spy">
                <h2 class="section-header">Get In Touch</h2>
                
                <div class="list-item">
                    <a href="https://www.instagram.com/handtheler/" target="_blank" class="contact-link">
                        <div class="item-title">Instagram</div>
                        <span class="item-subtitle">@handtheler</span>
                    </a>
                    <a href="https://www.instagram.com/sdcardreaderdslr/" target="_blank" class="contact-link">
                        <div class="item-title">Photography Account</div>
                        <span class="item-subtitle">@sdcardreaderdslr</span>
                    </a>
                </div>

                <div class="list-item">
                    <a href="https://www.linkedin.com/in/timoteo-pelayo-303906292/" target="_blank" class="contact-link">
                        <div class="item-title">LinkedIn</div>
                        <span class="item-subtitle">linkedin.com/in/timoteo-pelayo-303906292/</span>
                    </a>
                </div>

                <div class="list-item">
                    <a href="https://github.com/apctpelayo" target="_blank" class="contact-link">
                        <div class="item-title">GitHub</div>
                        <span class="item-subtitle">github.com/apctpelayo</span>
                    </a>
                </div>
            </section>

        </main>
        
        <div v-if="showResources" class="modal-overlay" @click.self="showResources = false">
            <div class="modal-content">
                <button class="modal-close" @click="showResources = false">×</button>
                <h2 class="section-header" style="margin-bottom: 20px;">Project Resources</h2>
                
                <div class="list-item" style="border: none; padding-bottom: 0; margin-bottom: 0;">
                    
                    <a href="https://gemini.google.com/share/878fdd413429" target="_blank" class="contact-link" style="margin-bottom: 20px;">
                        <div class="item-title">Google Gemini</div>
                        <span class="item-subtitle">AI Assistant / Code Troubleshooting</span>
                    </a>

                    <a href="https://camillemormal.com/about" target="_blank" class="contact-link">
                        <div class="item-title">Inspiration</div>
                        <span class="item-subtitle">camillemormal.com/about</span>
                    </a>

                </div>
            </div>
        </div>

    </div>
</template>