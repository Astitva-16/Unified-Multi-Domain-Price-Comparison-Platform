import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-card mt-16">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4 gradient-text">ComparePro</h3>
          <p className="text-sm text-muted-foreground">Compare prices across shopping, food, travel, and more — all in one place.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">About</Link></li>
            <li><Link to="/" className="hover:text-foreground transition-colors">Careers</Link></li>
            <li><Link to="/" className="hover:text-foreground transition-colors">Press</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Help Center</Link></li>
            <li><Link to="/" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            <li><Link to="/" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            <li><Link to="/" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            <li><Link to="/" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ComparePro. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
