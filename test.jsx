  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      event_entry_date: values.event_entry_date
        ? dayjs(values.event_entry_date).format("YYYY-MM-DD")
        : "",
    };
    try {
      const res = await submitTrigger({
        url: isEditMode ? `${EVENT_TRACK}/${eventId}` : EVENT_TRACK,
        method: isEditMode ? "put" : "post",
        data: formattedValues,
      });

      if (res.code == 201) {
        message.success(res.message || "Event saved!");
        setOpenDialog(false);
        fetchEvents();
      } else {
        message.error(res.message || "Failed to save event.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      message.error(error.response.data.message || "Something went wrong.");
    }
  };