import Button from "../components/Button";
import Almoco from "../assets/Almoço caseiro.png";
import Image from "../components/Image";
import Logo from "../components/Logo";
import heart from "../assets/heart.png";
import googleIcon from "../assets/Google.png";
import facebookIcon from "../assets/Facebook.png";
import appleIcon from "../assets/Apple.png";


export default function WelcomeScreen() {
    const backgroundfont = { color: '#000000' };

    return (
        <main className="flex min-h-svh flex-col items-center bg-gray-100">
            <div className="flex w-full flex-1 flex-col items-center justify-center pb-8">
            <Logo size_height={100} size_width={200} />
            <div className="mt-4 grid grid-cols-1 gap-2 text-center relative">
                <Image src={Almoco} alt="imagem principal" className="w-75 h-auto mb-4 -mt-10" />
                <div className="absolute left-4 top-42.5 h-6.5 w-45 gap-2 rounded-[20px] bg-[#EBEBD3]">
                    <Image src={heart} alt="Cora??o" className="absolute left-1.5 top-1 h-4 w-4" />
                    <p style={backgroundfont} className="absolute left-8 top-0.5 text-[10px] font-bold">Menos tempo na sua rotina</p>
                </div>
                <h2 style={backgroundfont}>Comer bem, viver sem peso</h2>
                <p style={backgroundfont} className="text-[10px] leading-[15px]">
                    Conectamos quem faz com quem precisa,<br /> unindo microempreendedores a pessoas<br /> com restrições alimentares.
                </p>
            </div>

            </div>

            <div className="w-full shrink-0">
                <div className="flex h-[23vh] rounded-[20px_20px_0px_0px] bg-[#0D4889]">
                    <div className="mt-auto flex h-[20vh] w-full flex-col items-center justify-center gap-3 rounded-[20px_20px_0px_0px] bg-[#FFB703]">
                        <Button className="self-center w-[min(80vw,320px)] h-[min(40px,8vh)] font-moderustic">Entrar</Button>
                        <div className="grid grid-cols-3 gap-3">
                            <button aria-label="Continuar com Google" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E4DA] bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D4889]">
                                <Image src={googleIcon} alt="Icone do Google" className="h-5 w-5 object-contain shadow-none" />
                            </button>
                            <button aria-label="Continuar com Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E4DA] bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D4889]">
                                <Image src={facebookIcon} alt="Icone do Facebook" className="h-9 w-9 object-contain shadow-none" />
                            </button>
                            <button aria-label="Continuar com Apple" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E4DA] bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D4889]">
                                <Image src={appleIcon} alt="Icone do Apple" className="h-5 w-5 object-contain shadow-none  " />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

