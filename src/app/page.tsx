import { Form } from '../components/Form';
import Image from 'next/image';
export default function Home() {
  return (
    <div className="bg-white flex  items-center justify-center h-screen w-screen relative ">
      <div className="flex  items-center justify-between flex-col  lg:flex-row">
        <div className="flex flex-col items-center justify-center  lg:flex-row">
          <div className="w-full bg-cover relative max-w-md lg:max-w-2xl lg:w-7/12 hidden md:flex">
            <div className="flex flex-col items-center justify-center w-full h-full relative ">
              <Image
                height={500}
                width={500}
                src="https://res.cloudinary.com/macxenon/image/upload/v1631570592/Run_-_Health_qcghbu.png"
                alt="Health Run"
                className="btn-"
              />
            </div>
          </div>
          <Form />
        </div>
      </div>
    </div>
  );
}