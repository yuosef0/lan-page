const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const HomePage = require('./models/HomePage');
const AboutPage = require('./models/AboutPage');
const TeamMember = require('./models/TeamMember');
const ServicesPage = require('./models/ServicesPage');
const Service = require('./models/Service');
const ContactInfo = require('./models/ContactInfo');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apex-base-portfolio');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await HomePage.deleteMany({});
    await AboutPage.deleteMany({});
    await TeamMember.deleteMany({});
    await ServicesPage.deleteMany({});
    await Service.deleteMany({});
    await ContactInfo.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@apexbase.com',
      password: 'Admin123!',
      role: 'admin'
    });

    console.log('Admin user created');

    // Create Home Page
    const homePage = await HomePage.create({
      hero: {
        title: 'Beyond Construction',
        subtitle: 'At A.B. we are committed to helping our clients bring their visions to life.'
      },
      featureCards: [
        {
          title: 'Proven Track Record',
          description: 'Our extensive portfolio of successful projects speaks for itself, showcasing our commitment to quality and excellence.',
          image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
          order: 1
        },
        {
          title: 'Forward-Thinking Approach',
          description: 'We leverage the latest technology and sustainable practices to deliver innovative and efficient construction solutions.',
          image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
          order: 2
        },
        {
          title: 'Trusted Partnership',
          description: 'We believe in collaborative relationships with our clients, ensuring transparency and reliability from start to finish.',
          image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
          order: 3
        }
      ]
    });

    console.log('Home page created');

    // Create About Page
    const aboutPage = await AboutPage.create({
      hero: {
        title: 'About Apex & Base',
        subtitle: 'Building Beyond Construction: Crafting visions into reality with integrity, quality, and innovation.'
      },
      mission: {
        title: 'Our Mission',
        content: 'Our mission is to deliver exceptional construction services by building lasting relationships with our clients through transparency, collaboration, and a relentless commitment to quality. We strive to exceed expectations and turn our clients\' visions into tangible, enduring structures.'
      },
      values: {
        title: 'Our Values',
        content: 'At Apex & Base, our core values of integrity, innovation, and client-centricity guide every decision we make. We believe in honest communication, pioneering new techniques for efficiency and sustainability, and placing our clients\' goals at the heart of every project.'
      },
      missionImage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
      principlesSection: {
        title: 'Our Guiding Principles',
        subtitle: 'We are defined by our commitment to these core principles in every project we undertake.'
      },
      principles: [
        {
          icon: 'trophy',
          title: 'Proven Track Record',
          description: 'Highlighting years of experience, successful project completions, and unwavering reliability.',
          order: 1
        },
        {
          icon: 'lightbulb',
          title: 'Forward-Thinking Approach',
          description: 'Utilizing modern technology, sustainable practices, and innovative solutions to build for the future.',
          order: 2
        },
        {
          icon: 'handshake',
          title: 'Trusted Partnership',
          description: 'Focusing on client collaboration and clear communication to realize their unique vision.',
          order: 3
        }
      ],
      teamSection: {
        title: 'Meet Our Leadership',
        subtitle: 'Our dedicated team of professionals is the cornerstone of our success, bringing expertise and passion to every project.'
      }
    });

    console.log('About page created');

    // Create Team Members
    const teamMembers = await TeamMember.insertMany([
      {
        name: 'Johnathan Doe',
        position: 'Founder & CEO',
        bio: 'With over 25 years in the industry, Johnathan\'s vision guides our commitment to excellence.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        order: 1
      },
      {
        name: 'Jane Smith',
        position: 'Lead Architect',
        bio: 'Jane translates bold ideas into beautiful, functional designs that stand the test of time.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        order: 2
      },
      {
        name: 'Michael Johnson',
        position: 'Head of Operations',
        bio: 'Michael ensures every project runs smoothly, on time, and within budget with meticulous oversight.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        order: 3
      },
      {
        name: 'Emily Williams',
        position: 'Client Relations Manager',
        bio: 'Emily is the bridge between our clients and our team, ensuring clear communication and satisfaction.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        order: 4
      }
    ]);

    console.log('Team members created');

    // Create Services Page
    const servicesPage = await ServicesPage.create({
      hero: {
        title: 'Our Construction Services',
        subtitle: 'We help you plan, design, and build with precision and creativity.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200'
      }
    });

    console.log('Services page created');

    // Create Services
    const services = await Service.insertMany([
      {
        title: 'Elevate Your Business',
        description: 'We focus on commercial construction, fostering growth through professional partnerships and impeccable execution. Our commitment is to build spaces that not only meet but exceed your business needs.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        imagePosition: 'left',
        order: 1,
        isActive: true
      },
      {
        title: 'Focus on Your Vision',
        description: 'Through close client collaboration and custom build solutions, we bring your unique ideas to life exactly as you envisioned. Your dream is the blueprint for our craftsmanship.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        imagePosition: 'right',
        order: 2,
        isActive: true
      },
      {
        title: 'Data-Driven Decisions',
        description: 'Leveraging the latest in project management technology, we ensure efficient execution and transparent communication from start to finish, keeping your project on time and on budget.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        imagePosition: 'left',
        order: 3,
        isActive: true
      }
    ]);

    console.log('Services created');

    // Create Contact Info
    const contactInfo = await ContactInfo.create({
      hero: {
        title: 'Get In Touch',
        subtitle: 'We\'re here to help and answer any question you might have. We look forward to hearing from you.'
      },
      office: {
        title: 'Our Office',
        address: '123 Construction Ave, Suite 456, Builderville, ST 78910',
        phone: '(123) 456-7890',
        email: 'contact@apexbase.com',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.622956276834!2d-73.9878536845941!3d40.74844097932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1622055622836!5m2!1sen!2sus'
      },
      socialLinks: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com'
      },
      footer: {
        companyName: 'Apex & Base Constructions Company L.L.C',
        copyright: '© 2024 Apex & Base Constructions Company L.L.C. All Rights Reserved.',
        foundedYear: '2005',
        tagline: 'Building visions into reality since 2005.'
      }
    });

    console.log('Contact info created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Admin Login:');
    console.log('Email: admin@apexbase.com');
    console.log('Password: Admin123!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed
connectDB().then(() => {
  seedData();
});
