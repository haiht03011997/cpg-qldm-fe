type IPopupScroll = {
    e : any,
    currentPage : number,
    totalPages : number
}
export const handlePopupScroll = (props:IPopupScroll) => {
    // Xác định khi nào phải tải thêm dữ liệu khi cuộn
    const { target } = props.e;
    if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      if (props.currentPage < props.totalPages) {
        return props.currentPage + 1;
      }
    }
  };