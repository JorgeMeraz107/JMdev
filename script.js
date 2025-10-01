// DOM Elements
const navToggle = document.getElementById("navToggle")
const navMenu = document.querySelector(".nav-menu")
const categoryBtns = document.querySelectorAll(".category-btn")
const courseSections = document.querySelectorAll(".course-section")
const navLinks = document.querySelectorAll(".nav-link")

// Mobile Navigation Toggle
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")

  // Animate hamburger menu
  const spans = navToggle.querySelectorAll("span")
  spans.forEach((span, index) => {
    if (navMenu.classList.contains("active")) {
      if (index === 0) span.style.transform = "rotate(45deg) translate(5px, 5px)"
      if (index === 1) span.style.opacity = "0"
      if (index === 2) span.style.transform = "rotate(-45deg) translate(7px, -6px)"
    } else {
      span.style.transform = "none"
      span.style.opacity = "1"
    }
  })
})

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    const spans = navToggle.querySelectorAll("span")
    spans.forEach((span) => {
      span.style.transform = "none"
      span.style.opacity = "1"
    })
  })
})

// Course Category Filtering
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category

    // Update active button
    categoryBtns.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    // Show/hide course sections with animation
    courseSections.forEach((section) => {
      const sectionCategory = section.dataset.category

      if (category === "all" || sectionCategory === category) {
        section.style.display = "block"
        section.classList.add("fade-in")

        // Remove animation class after animation completes
        setTimeout(() => {
          section.classList.remove("fade-in")
        }, 600)
      } else {
        section.style.display = "none"
      }
    })
  })
})

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))

    if (target) {
      const headerHeight = document.querySelector(".header").offsetHeight
      const targetPosition = target.offsetTop - headerHeight - 20

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Active Navigation Link Based on Scroll Position
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]")
  const scrollPos = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
})

// Video Loading Optimization
const observerOptions = {
  root: null,
  rootMargin: "50px",
  threshold: 0.1,
}

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const iframe = entry.target.querySelector("iframe")
      if (iframe && !iframe.src.includes("autoplay=0")) {
        // Add autoplay=0 to prevent auto-playing when scrolling
        const currentSrc = iframe.src
        if (!currentSrc.includes("autoplay=0")) {
          iframe.src = currentSrc + (currentSrc.includes("?") ? "&" : "?") + "autoplay=0"
        }
      }
    }
  })
}, observerOptions)

// Observe all video cards
document.querySelectorAll(".video-card").forEach((card) => {
  videoObserver.observe(card)
})

// Search Functionality (Basic)
function createSearchBar() {
  const searchContainer = document.createElement("div")
  searchContainer.className = "search-container"
  searchContainer.style.cssText = `
        max-width: 400px;
        margin: 0 auto 2rem;
        position: relative;
    `

  const searchInput = document.createElement("input")
  searchInput.type = "text"
  searchInput.placeholder = "Buscar cursos..."
  searchInput.className = "search-input"
  searchInput.style.cssText = `
        width: 100%;
        padding: 12px 16px;
        border: 2px solid var(--gray-300);
        border-radius: var(--radius-lg);
        font-size: var(--font-size-base);
        transition: border-color 0.2s ease;
    `

  searchInput.addEventListener("focus", () => {
    searchInput.style.borderColor = "var(--accent-color)"
  })

  searchInput.addEventListener("blur", () => {
    searchInput.style.borderColor = "var(--gray-300)"
  })

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase()
    const videoCards = document.querySelectorAll(".video-card")

    videoCards.forEach((card) => {
      const title = card.querySelector("h5").textContent.toLowerCase()
      const description = card.querySelector("p").textContent.toLowerCase()

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = "block"
      } else {
        card.style.display = searchTerm === "" ? "block" : "none"
      }
    })
  })

  searchContainer.appendChild(searchInput)

  // Insert search bar before course categories
  const coursesSection = document.querySelector(".courses .container")
  const categoryContainer = document.querySelector(".course-categories")
  coursesSection.insertBefore(searchContainer, categoryContainer)
}

// Initialize search bar
document.addEventListener("DOMContentLoaded", () => {
  createSearchBar()

  // Add fade-in animation to elements on page load
  const animatedElements = document.querySelectorAll(".video-card, .resource-card, .subject-card")
  animatedElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("fade-in")
    }, index * 100)
  })
})

// Keyboard Navigation Support
document.addEventListener("keydown", (e) => {
  // ESC key closes mobile menu
  if (e.key === "Escape" && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active")
    const spans = navToggle.querySelectorAll("span")
    spans.forEach((span) => {
      span.style.transform = "none"
      span.style.opacity = "1"
    })
  }
})

// Performance: Lazy load video thumbnails
function lazyLoadVideoThumbnails() {
  const iframes = document.querySelectorAll('iframe[src*="youtube.com"]')

  iframes.forEach((iframe) => {
    const videoId = iframe.src.match(/embed\/([^?]+)/)?.[1]
    if (videoId) {
      // Create thumbnail image
      const thumbnail = document.createElement("img")
      thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      thumbnail.alt = "Video thumbnail"
      thumbnail.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                cursor: pointer;
                transition: opacity 0.3s ease;
            `

      // Create play button overlay
      const playButton = document.createElement("div")
      playButton.innerHTML = "▶"
      playButton.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            `

      playButton.addEventListener("mouseenter", () => {
        playButton.style.background = "rgba(0,0,0,0.9)"
        playButton.style.transform = "translate(-50%, -50%) scale(1.1)"
      })

      playButton.addEventListener("mouseleave", () => {
        playButton.style.background = "rgba(0,0,0,0.8)"
        playButton.style.transform = "translate(-50%, -50%) scale(1)"
      })

      // Replace iframe with thumbnail initially
      const wrapper = iframe.parentElement
      wrapper.style.position = "relative"
      wrapper.appendChild(thumbnail)
      wrapper.appendChild(playButton)
      iframe.style.display = "none"

      // Load actual video when clicked
      const loadVideo = () => {
        thumbnail.style.opacity = "0"
        playButton.style.opacity = "0"
        setTimeout(() => {
          thumbnail.remove()
          playButton.remove()
          iframe.style.display = "block"
          iframe.src = iframe.src + "&autoplay=1"
        }, 300)
      }

      thumbnail.addEventListener("click", loadVideo)
      playButton.addEventListener("click", loadVideo)
    }
  })
}

// Initialize lazy loading after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(lazyLoadVideoThumbnails, 1000)
})

// Add loading states for better UX
function showLoadingState(element) {
  element.style.opacity = "0.6"
  element.style.pointerEvents = "none"
}

function hideLoadingState(element) {
  element.style.opacity = "1"
  element.style.pointerEvents = "auto"
}

// Error handling for failed video loads
document.addEventListener("DOMContentLoaded", () => {
  const iframes = document.querySelectorAll("iframe")

  iframes.forEach((iframe) => {
    iframe.addEventListener("error", () => {
      const wrapper = iframe.parentElement
      const errorMessage = document.createElement("div")
      errorMessage.textContent = "Error al cargar el video"
      errorMessage.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--danger-color);
                color: white;
                padding: 1rem;
                border-radius: var(--radius-md);
                font-size: var(--font-size-sm);
            `
      wrapper.appendChild(errorMessage)
    })
  })
})
