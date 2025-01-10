const sections = document.querySelectorAll(".full-screen");
const slides = document.querySelector('.slides');
const images = slides.querySelectorAll('img');
let currentIndex = 0; // 目前顯示的幻燈片索引
const totalSlides = images.length;

// 切換幻燈片
function changeSlide(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    } else if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }

    // 更新幻燈片的位置
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// 滾動觸發動畫
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.slide-in');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        if (position < windowHeight - 100) {
            element.classList.add('show');
        } else {
            element.classList.remove('show');
        }
    });
}

// 處理全屏區塊的滾動事件
function handleSectionScroll() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollY > sectionTop - sectionHeight / 2 && scrollY < sectionTop + sectionHeight / 2) {
            section.classList.add("active");
        } else {
            section.classList.remove("active");
        }
    });
}

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 表單提交邏輯
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this); // 包含表單數據和檔案
    fetch("http://localhost:5500/contact", {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("formResponse").style.display = "block";
                this.reset();
            } else {
                alert("提交失敗，請稍後再試！");
            }
        })
        .catch(err => {
            console.error("提交錯誤：", err);
            alert("提交時發生錯誤，請檢查網絡連接！");
        });
});


// 初始觸發一次滾動動畫檢查
document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimations();
    handleSectionScroll();
});

// 優化滾動事件觸發
const optimizedScroll = debounce(() => {
    handleScrollAnimations();
    handleSectionScroll();
}, 100);

window.addEventListener('scroll', optimizedScroll);

// 自動切換圖片
let currentImageIndex = 0;
const productImages = document.querySelectorAll(".product-image");

if (productImages.length > 0) {
    setInterval(() => {
        productImages[currentImageIndex].classList.add("hidden");
        currentImageIndex = (currentImageIndex + 1) % productImages.length;
        productImages[currentImageIndex].classList.remove("hidden");
    }, 3000);
}
