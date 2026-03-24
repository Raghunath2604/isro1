/** @type {import('tailwindcss').Config} */
export default {
content: [
"./index.html",
"./src/**/*.{js,jsx}",
],
theme: {
extend: {
colors: {
'space-dark': '#0a0e27',
'space-blue': '#1e3a8a',
'space-cyan': '#06b6d4',
'space-purple': '#8b5cf6',
},
fontFamily: {
'mono': ['Courier New', 'monospace'],
},
},
},
plugins: [],
}