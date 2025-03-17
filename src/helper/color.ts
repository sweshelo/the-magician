export const getColorCode = (color: number) => {
  switch (color) {
    case 0:
      return 'bg-gray-400';
    case 1:
      return 'bg-red-700';
    case 2:
      return 'bg-yellow-600';
    case 3:
      return 'bg-blue-500';
    case 4:
      return 'bg-green-600';
    case 5:
      return 'bg-purple-800';
  }
}