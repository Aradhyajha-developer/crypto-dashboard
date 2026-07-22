export default function Header() {
  return `
<header class="header">

<div class="logo">
🚀 CryptoDash
</div>

<nav>

<a href="#home" id="nav-home">
Home
</a>

<a href="#favorites" id="nav-favorites">
Favorites
</a>

<a href="#about" id="nav-about">
About
</a>

<button
id="themeBtn"
class="theme-btn"
title="Toggle Theme">

🌙

</button>

</nav>

</header>
`;
}