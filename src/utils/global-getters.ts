export function getColorByTag(tag: string) {
  switch (tag) {
    case 'Backend':
      return '#a81627';
    case 'Support':
      return '#f5a623';
    case 'Frontend':
      return '#4a90e2';
    case 'Design':
      return '#7ed321';
    case 'Finance':
      return '#9013fe';
    default:
      return '#000000';
  }
}
