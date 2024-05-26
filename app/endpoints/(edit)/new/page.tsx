import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';

export default function CreateNewEndpointPage() {
  return (
    <div className="flex flex-col pt-4 w-full h-full">
      <NewEndpointForm disablePopupLayout />
    </div>
  );
}
