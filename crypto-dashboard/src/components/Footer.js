export default function Footer() {

  const year = new Date().getFullYear();

  return `

    <footer class="footer">

      <p>

        © ${year} CryptoDash

      </p>

      <small>

        Built with Vite • CoinGecko API • Chart.js

      </small>

    </footer>

  `;

}