import Button from "../components/Button";
import Almoco from "../assets/Almoço caseiro.png";
import Image from "../components/Image";
import Logo from "../components/Logo";

export default function WelcomeScreen() {

    const backgroundfont = {
        color: '#000000',
    }
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Logo size_height={100} size_width={200}  />
            <div className="grid grid-cols-1 gap-2 text-center mt-4">
                
                <Image src={Almoco} alt="imagem principal" className="w-75 h-auto mb-4 -mt-10" />
                <h2 style={backgroundfont} >Comer bem, viver sem peso</h2>
                <p style={backgroundfont} className="text-[10px] leading-[15px] ">Conectamos quem faz com quem precisa, <br /> unindo microempreendedores a pessoas <br /> com restrições alimentares.</p>
            </div>

            <div className="w-full mt-auto  ">
                <div className=" bg-[#0D4889] h-[23vh] flex rounded-[20px_20px_0px_0px]">
                    <div
                        className="mt-auto flex h-[20vh] w-full items-center justify-center bg-[#FFB703] rounded-[20px_20px_0px_0px]">
                        <Button className="px-30 py-4">
                            Entrar
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}