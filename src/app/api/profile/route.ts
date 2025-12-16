import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, currentPassword, newPassword } = await request.json()

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password required' }, { status: 400 })
      }

      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }
    }

    // Update user data
    const updateData: any = { name, email }
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: { id: true, name: true, email: true, createdAt: true }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}