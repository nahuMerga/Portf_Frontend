import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.post(`${BASE_URL}/contact_us/`, formData);
      toast.success("Message sent successfully!", {
        position: "top-center",
        autoClose: 5000, // Message disappears after 5 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      toast.error("Failed to send message. Try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <br></br>
      <br></br>
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="name" placeholder="Name" className="glass" onChange={handleChange} required />
            <Input name="email" type="email" placeholder="Email" className="glass" onChange={handleChange} required />
            <Textarea name="message" placeholder="Message" className="glass min-h-[150px]" onChange={handleChange} required />
            <Button className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Contact;