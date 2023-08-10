import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="w-full h-screen">
      <ReactSwagger spec={spec} />
    </section>
  );
}