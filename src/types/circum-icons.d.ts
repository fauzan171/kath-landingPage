declare module '@klarr-agency/circum-icons-react' {
  import { ComponentType, SVGProps } from 'react';

  interface IconProps extends SVGProps<SVGSVGElement> {
    name: string;
    size?: string;
    color?: string;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}