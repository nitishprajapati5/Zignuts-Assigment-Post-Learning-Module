import jsonToCsvExport from 'json-to-csv-export';
import dayjs from 'dayjs';

export function exportTasksToCSV(tasksList) {
  if (!tasksList || tasksList.length === 0) return;

  const flattedData = tasksList.map((task) => ({
    Title: task.title || '',
    Description: task.description || '',
    Status: task.status || '',
    'Due Date': task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
    'Assigned To': task.assignedUserDetails?.email || '',
    'Created Date': task.createdAt?._seconds
      ? dayjs(task.createdAt._seconds * 1000).format('YYYY-MM-DD')
      : '',
    'Updated Date': task.updatedAt ? dayjs(task.updatedAt).format('YYYY-MM-DD HH:mm') : '',
  }));

  jsonToCsvExport({ data: flattedData, filename: 'Tasks List' });
}