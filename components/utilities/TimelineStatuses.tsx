export const getTimelineStatuses = (statusArray: any[], fallbackTime: string, orderData: any) => {
  const latestStatus = statusArray.length > 0
    ? statusArray[statusArray.length - 1].status.toLowerCase()
    : 'placed';

  const timelineSteps = [
    { label: 'Order placed!', time: orderData.created_at },
    { label: 'Preparing for dispatch', time: '' },
    { label: 'Out for delivery', time: '' },
    { label: 'Delivered', time: '' },
  ];

  let activeIndex = 0;

  const findStatusTime = (status: string) => {
    const s = statusArray.find((st: any) => st.status.toLowerCase() === status);
    return s?.created_at || fallbackTime;
  };

  switch (latestStatus) {
    case 'placed':
      activeIndex = 0;
      break;

    case 'preparing for dispatch':
      activeIndex = 1;
      timelineSteps[1].time = findStatusTime('preparing for dispatch');
      break;

    case 'out for delivery':
      activeIndex = 2;
      timelineSteps[1].time = findStatusTime('preparing for dispatch');
      timelineSteps[2].time = findStatusTime('out for delivery');
      break;

    case 'delivered':
      activeIndex = 3;
      timelineSteps[1].time = findStatusTime('preparing for dispatch');
      timelineSteps[2].time = findStatusTime('out for delivery');
      timelineSteps[3].time = findStatusTime('delivered');
      break;

    case 'cancelled':
      const cancelledTime = findStatusTime('cancelled');
      return {
        steps: [
          timelineSteps[0],
          { label: 'Cancelled by you / store', time: cancelledTime, isCancelled: true },
        ],
        activeIndex: 1,
        isCancelled: true,
      };
  }

  return {
    steps: timelineSteps,
    activeIndex,
    isCancelled: false,
  };
};
