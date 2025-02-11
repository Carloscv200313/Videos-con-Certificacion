import { Form } from '../components/Form';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-[#fafafa] flex items-center justify-center h-screen">
      <div className="flex flex-col items-center  md:flex-row w-full">
        {/* Sección del robot */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="bg-cover max-w-md lg:max-w-2xl w-full h-full hidden md:flex">
            <div className="flex items-center justify-end w-full h-full relative">
              <Image
                priority
                height={566}
                width={378}
                src="/expersito.gif"
                alt="Health Run"
                className="bg-transparent"
              />
            </div>
          </div>
        </div>
        {/* Sección del formulario */}
        <div className="w-4/5 lg:w-1/2 flex items-center justify-start">
          <Form />
        </div>
      </div>
    </div>
  );
}
