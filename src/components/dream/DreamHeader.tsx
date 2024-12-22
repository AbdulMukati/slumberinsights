import { CardHeader, CardTitle } from "@/components/ui/card";

interface DreamHeaderProps {
  title: string;
}

const DreamHeader = ({ title }: DreamHeaderProps) => (
  <CardHeader>
    <CardTitle className="text-2xl text-purple-900 dark:text-purple-100 text-left">
      {title}
    </CardTitle>
  </CardHeader>
);

export default DreamHeader;