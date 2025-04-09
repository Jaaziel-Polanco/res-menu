import type { Metadata } from "next";
import { Inter, Roboto, Poppins, Open_Sans, Montserrat, Lato, Playfair_Display, Nunito, Raleway, Merriweather, Ubuntu, Work_Sans, Fira_Sans, Quicksand, Josefin_Sans, Space_Grotesk, Source_Sans_3, Josefin_Slab, Archivo, Lexend_Deca, DM_Sans, Noto_Sans, Sora, Rubik, Barlow, } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const roboto = Roboto({ variable: '--font-roboto', weight: ['400', '700'], subsets: ['latin'] });
const poppins = Poppins({ variable: '--font-poppins', weight: ['400', '600'], subsets: ['latin'] });
const openSans = Open_Sans({ variable: '--font-open-sans', subsets: ['latin'] });
const montserrat = Montserrat({ variable: '--font-montserrat', subsets: ['latin'] });
const lato = Lato({ variable: '--font-lato', weight: ['400', '700'], subsets: ['latin'] });
const playfair = Playfair_Display({ variable: '--font-playfair-display', subsets: ['latin'] });
const nunito = Nunito({ variable: '--font-nunito', subsets: ['latin'] });
const raleway = Raleway({ variable: '--font-raleway', subsets: ['latin'] });
const merriweather = Merriweather({ variable: '--font-merriweather', weight: ['400', '700'], subsets: ['latin'] });
const sourceSans = Source_Sans_3({ variable: '--font-source-sans', subsets: ['latin'] }); const ubuntu = Ubuntu({ variable: '--font-ubuntu', weight: ['400', '500'], subsets: ['latin'] });
const workSans = Work_Sans({ variable: '--font-work-sans', subsets: ['latin'] });
const firaSans = Fira_Sans({ variable: '--font-fira-sans', weight: ['400', '500'], subsets: ['latin'] });
const quicksand = Quicksand({ variable: '--font-quicksand', subsets: ['latin'] });
const josefin = Josefin_Sans({ variable: '--font-josefin-sans', subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'] });
const josefinSlab = Josefin_Slab({ variable: '--font-josefin-slab', weight: ['700'], subsets: ['latin'] });
const archivo = Archivo({ variable: '--font-archivo', weight: ['400', '500'], subsets: ['latin'] });
const lexendDeca = Lexend_Deca({ variable: '--font-lexend-deca', subsets: ['latin'] });
const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'] });
const notoSans = Noto_Sans({ variable: '--font-noto-sans', subsets: ['latin'] });
const sora = Sora({ variable: '--font-sora', subsets: ['latin'] });
const rubik = Rubik({ variable: '--font-rubik', subsets: ['latin'] });
const barlow = Barlow({ weight: '400', variable: '--font-barlow', subsets: ['latin'] });


export const metadata: Metadata = {
  title: "Menú Digital",
  description: "Ordena tus platillos favoritos en línea",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${roboto.variable} ${poppins.variable} ${openSans.variable} ${montserrat.variable} ${lato.variable} ${playfair.variable} ${nunito.variable} ${raleway.variable} ${merriweather.variable} ${ubuntu.variable} ${workSans.variable} ${firaSans.variable} ${quicksand.variable} ${josefin.variable} ${spaceGrotesk.variable} ${sourceSans.variable} ${barlow.variable} ${josefinSlab.variable} ${archivo.variable} ${lexendDeca.variable} ${dmSans.variable} ${notoSans.variable} ${sora.variable} ${rubik.variable}`}>
      <body
        suppressHydrationWarning
        className="bg-black text-white custom-scroll"
        style={{ fontFamily: 'var(--main-font, var(--font-inter))' }}
      >
        {children}
      </body>
    </html>
  );
}