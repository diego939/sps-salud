
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const diffWithCurrentDate = (date: string) => {
  const currentDate = new Date().getTime()
  const createdDate = new Date(date).getTime()
  const differenceInMilliseconds = currentDate - createdDate;
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.floor(differenceInMilliseconds / millisecondsPerDay);
}