import { CustomLink } from '@/app/components/customLink';

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <CustomLink href="/">Return Home</CustomLink>
    </div>
  );
}
