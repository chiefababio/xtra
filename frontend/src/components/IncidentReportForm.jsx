import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function IncidentReportForm() {
  const [incident, setIncident] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
  });

  const [submittedIncident, setSubmittedIncident] = useState(null);

  const handleChange = (e) => {
    setIncident({ ...incident, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incident),
    });
    const data = await response.json();
    setSubmittedIncident(data.incident);
  };

  const downloadReport = async (type) => {
    const url = `http://localhost:8000/api/incidents/${submittedIncident.id}/report/${type}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${submittedIncident.title}.${type}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Report a Safety Incident</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Incident Title"
            value={incident.title}
            onChange={handleChange}
            required
          />
          <Textarea
            name="description"
            placeholder="Detailed Description"
            value={incident.description}
            onChange={handleChange}
            required
          />
          <Input
            name="location"
            placeholder="Location"
            value={incident.location}
            onChange={handleChange}
            required
          />
          <Input
            name="date"
            type="date"
            value={incident.date}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full">Submit Incident</Button>
        </form>

        {submittedIncident && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Download Report:</h3>
            <Button className="mr-2" onClick={() => downloadReport('pdf')}>PDF Report</Button>
            <Button onClick={() => downloadReport('docx')}>Word Report</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
