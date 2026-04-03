# Simple React Project for Learning

This project was created with Vite and React.

## Step 1: Create the project

```bash
npm create vite@latest . -- --template react
```

## Step 2: Install packages

```bash
npm install
```

## Step 3: Start the project

```bash
npm run dev
```

Vite will show a local URL like:

```bash
http://localhost:5173/
```

Open that URL in your browser.

## Step 4: Understand the main files

- `src/main.jsx` starts the React app.
- `src/App.jsx` contains the main component.
- `src/App.css` styles the app.
- `src/index.css` adds global styles.

## Step 5: What you are learning in this app

- JSX: Writing HTML-like code inside JavaScript.
- Components: `App` is a React component.
- State: `useState` stores changing values.
- Events: `onClick` and `onChange` handle user actions.
- Lists: `map()` prints multiple items on the screen.

## Step 6: Small practice tasks

Try these yourself:

1. Change the heading text.
2. Add one more button to decrease the counter.
3. Add more items to the topics list.
4. Change the colors in `App.css`.
5. Create a new component like `Header.jsx`.

## Step 7: Build for production

```bash
npm run build
```

This checks that the project compiles correctly.

## Contact Form Setup

This project now includes EmailJS-based contact form support and WhatsApp chat.

1. Copy `.env.example` to `.env.local`
2. Add your EmailJS values:

```bash
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

3. In your EmailJS template, use these variables:

- `from_name`
- `reply_to`
- `business_type`
- `budget`
- `project_details`
- `submitted_at`
