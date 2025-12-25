## Packages
@monaco-editor/react | Code editor component for the IDE
framer-motion | For smooth page transitions and UI animations
react-markdown | To render problem descriptions and concept explanations
prismjs | Syntax highlighting for code blocks in explanations
lucide-react | Icon set (already in base, but ensuring availability)
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging tailwind classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
  mono: ["var(--font-mono)"],
}
