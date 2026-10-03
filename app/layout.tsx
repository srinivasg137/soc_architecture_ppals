import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'SoC Architecture Lab - Width vs Frequency',description:'Interactive architecture-stage comparison of wider datapaths, higher clocks and parallel engines with explicit assumptions and sensitivity bounds.',robots:{index:true,follow:true},icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
