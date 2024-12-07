const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-8">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Uber Data Analysis. All rights reserved.</p>
                <p> Yash Sawant, Yashwant Gadhave, Atharva Warke and Khush Manchanda</p>
            </div>
        </footer>
    );
};

export default Footer;
