# 💕 Valentine's Day App - Deploy заавар 💕

## Deploy хийх арга замууд:

### 1. Vercel дээр deploy хийх (Хамгийн хялбар)

1. [Vercel](https://vercel.com) дээр бүртгүүлэх
2. GitHub repository-оо холбох
3. `my-react-app` folder-ийг root болгох
4. Deploy дарах - автоматаар deploy хийгдэнэ!

Эсвэл Vercel CLI ашиглах:
```bash
cd my-react-app
npm install -g vercel
vercel
```

### 2. Netlify дээр deploy хийх

1. [Netlify](https://netlify.com) дээр бүртгүүлэх
2. "Add new site" → "Import an existing project"
3. GitHub repository-оо сонгох
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy дарах

Эсвэл Netlify CLI:
```bash
cd my-react-app
npm install -g netlify-cli
netlify deploy --prod
```

### 3. GitHub Pages дээр deploy хийх

1. GitHub repository дээр Settings → Pages руу орох
2. Source: GitHub Actions сонгох
3. `.github/workflows/deploy.yml` файл автоматаар ажиллана
4. Push хийх үед автоматаар deploy хийгдэнэ

### 4. Local дээр build хийх

```bash
cd my-react-app
npm install
npm run build
```

Build хийсэн файлууд `dist` folder дээр байрлана.

### 5. Preview хийх

```bash
cd my-react-app
npm run dev
```

Local дээр http://localhost:5173 дээр харагдана.

## Features:

- 💕 Beautiful Valentine's Day theme
- ❤️ Interactive hearts animation
- 💖 Click to create hearts
- 💗 Random love messages
- 💝 Responsive design
- 💓 Smooth animations

## Tech Stack:

- React 19
- Vite 7
- Modern CSS animations

