import './Skeleton.scss';

interface SkeletonProps {
  readonly height?: number | string;
  readonly width?: number | string;
  readonly borderRadius?: number | string;
}

function Skeleton({
  height = 20,
  width = '100%',
  borderRadius = '8px',
}: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{
        height,
        width,
        borderRadius,
      }}
    />
  );
}

Skeleton.defaultProps = {
  height: 20,
  width: '100%',
  borderRadius: '8px',
};

export default Skeleton;
