import { NewEndpointForm } from '@/app/views/models-management/newEnpointForm';
export const dynamic = 'force-dynamic';

export default function CreateNewEndpointPage() {
  return (
    <div className="flex flex-col pt-4 w-full h-full">
      <NewEndpointForm disablePopupLayout />
    </div>
  );
}
