import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Configurar el transporte de email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_API_KEY,
  },
});

async function sendWelcomeEmail(email: string, name: string) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_API_KEY) {
      console.warn('Variables de email no configuradas');
      return false;
    }

    const mailOptions = {
      from: `"Olas Accesory" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '¡Bienvenido a Olas Accesory! ✨',
      html: `
        <div style="font-family: 'Playfair Display', serif; background: linear-gradient(135deg, #304F40 0%, #6F1A07 100%); color: #FFFAEF; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 2.5rem; color: #E1D2BB;">Olas ✨</h1>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 12px; backdrop-filter: blur(10px);">
            <h2 style="margin-top: 0; font-size: 1.8rem; color: #E1D2BB;">¡Hola ${name}!</h2>
            
            <p style="font-size: 1.1rem; line-height: 1.8; margin: 20px 0;">
              Bienvenido a <strong>Olas Accesory</strong>, donde cada pieza cuenta una historia.
            </p>
            
            <p style="font-size: 1rem; line-height: 1.8; margin: 20px 0;">
              Tu cuenta ha sido creada exitosamente. Ahora puedes:
            </p>
            
            <ul style="font-size: 1rem; line-height: 2; margin: 20px 0; padding-left: 20px;">
              <li>✨ Explorar nuestros productos exclusivos</li>
              <li>🎁 Descubrir nuestras ofertas especiales</li>
              <li>💎 Acceder a materiales premium</li>
              <li>🛍️ Realizar compras seguras</li>
            </ul>
            
            <p style="font-size: 1rem; line-height: 1.8; margin: 20px 0;">
              Para comenzar, inicia sesión en nuestra plataforma y explora todo lo que tenemos para ti.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="display: inline-block; background: #E1D2BB; color: #304F40; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; font-family: 'Playfair Display', serif; font-size: 1.1rem;">
              Iniciar Sesión
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(225, 210, 187, 0.3);">
            <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">
              Si tienes preguntas, no dudes en contactarnos.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 0.85rem; opacity: 0.8;">
              © 2025 Olas Accesory. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email de bienvenida enviado a:', email);
    return true;
  } catch (error: any) {
    console.error('❌ Error al enviar email de bienvenida:', error.message);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, password, passwordConfirm } = body;

    // Validar que todos los campos estén presentes
    if (!name || !email || !password || !passwordConfirm) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todos los campos son requeridos',
        },
        { status: 400 }
      );
    }

    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
      return NextResponse.json(
        {
          success: false,
          error: 'Las contraseñas no coinciden',
        },
        { status: 400 }
      );
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres',
        },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'El email ya está registrado',
        },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'customer',
    });

    const savedUser = await newUser.save();

    // Enviar email de bienvenida
    const emailSent = await sendWelcomeEmail(email.toLowerCase(), name);
    
    if (!emailSent) {
      console.warn('El email de bienvenida no se envió, pero el usuario fue creado');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Usuario registrado exitosamente',
        emailSent: emailSent,
        data: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al registrar el usuario',
      },
      { status: 500 }
    );
  }
}
