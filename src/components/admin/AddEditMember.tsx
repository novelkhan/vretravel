import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import adminService from '../../services/AdminService';
import sharedService from '../../services/SharedService';
import { MemberAddEdit } from '../../models/admin';

// Zod Schema for Form Validation
const schema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  userName: z.string().min(1, 'Username is required'),
  password: z.string().optional().refine((val) => !val || (val.length >= 6 && val.length <= 15), {
    message: 'Password must be between 6 and 15 characters',
  }),
  roles: z.string().min(1, 'Please select at least one role'),
}).superRefine((data, ctx) => {
  if (!data.id && !data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password is required for new members',
      path: ['password'],
    });
  }
});

type FormData = z.infer<typeof schema>;

const AddEditMember: React.FC = () => {
  const [applicationRoles, setApplicationRoles] = useState<string[]>([]);
  const [existingMemberRoles, setExistingMemberRoles] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [formInitialized, setFormInitialized] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isAddNew = !id;

  const { control, handleSubmit, formState: { errors, isSubmitted }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: '',
      firstName: '',
      lastName: '',
      userName: '',
      password: '',
      roles: '',
    },
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const roles = await adminService.getApplicationRoles();
        setApplicationRoles(roles);

        if (id) {
          const member = await adminService.getMember(id);
          setValue('id', member.id || '');
          setValue('firstName', member.firstName);
          setValue('lastName', member.lastName);
          setValue('userName', member.userName);
          setValue('roles', member.roles);
          setExistingMemberRoles(member.roles.split(','));
        }
        setFormInitialized(true);
      } catch (error) {
        console.error('Failed to initialize form:', error);
      }
    };
    initialize();
  }, [id, setValue]);

  const passwordOnChange = (value: string) => {
    if (!isAddNew && !value) {
      setValue('password', '', { shouldValidate: false });
    }
  };

  const roleOnChange = (selectedRole: string) => {
    const roles = watch('roles').split(',').filter(Boolean);
    const index = roles.indexOf(selectedRole);
    if (index !== -1) {
      roles.splice(index, 1);
    } else {
      roles.push(selectedRole);
    }
    setValue('roles', roles.join(','), { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setErrorMessages([]);
    try {
      await adminService.addEditMember(data as MemberAddEdit);
      sharedService.showNotification(
        true,
        isAddNew ? 'Member Created' : 'Member Updated',
        `Member ${data.userName} has been ${isAddNew ? 'created' : 'updated'} successfully!`
      );
      navigate('/admin');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrorMessages(error.response.data.errors);
      } else {
        setErrorMessages([error.response?.data || 'An error occurred']);
      }
    }
  };

  if (!formInitialized) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <main style={{ width: '100%', padding: '15px' }}>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontWeight: 400 }}>
                <span style={{ color: '#ffc107' }}>{isAddNew ? 'Add' : 'Update'}</span> Member
              </h3>
            </div>

            {/* First Name */}
            <div style={{ position: 'relative', marginBottom: '1rem', height: '4rem' }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      placeholder=" "
                      style={{
                        width: '100%',
                        padding: '1rem 0.75rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #ced4da',
                        height: '3rem',
                        fontSize: '1rem',
                        ...(isSubmitted && errors.firstName ? { borderColor: '#dc3545' } : {}),
                      }}
                    />
                    <label
                      style={{
                        position: 'absolute',
                        top: field.value ? '0.25rem' : '1rem',
                        left: '0.75rem',
                        fontSize: field.value ? '0.75rem' : '1rem',
                        color: '#6c757d',
                        transition: 'all 0.2s ease',
                        pointerEvents: 'none',
                      }}
                    >
                      First name
                    </label>
                  </>
                )}
              />
              {isSubmitted && errors.firstName && (
                <span style={{ color: '#dc3545', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.firstName.message}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div style={{ position: 'relative', marginBottom: '1rem', height: '4rem' }}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      placeholder=" "
                      style={{
                        width: '100%',
                        padding: '1rem 0.75rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #ced4da',
                        height: '3rem',
                        fontSize: '1rem',
                        ...(isSubmitted && errors.lastName ? { borderColor: '#dc3545' } : {}),
                      }}
                    />
                    <label
                      style={{
                        position: 'absolute',
                        top: field.value ? '0.25rem' : '1rem',
                        left: '0.75rem',
                        fontSize: field.value ? '0.75rem' : '1rem',
                        color: '#6c757d',
                        transition: 'all 0.2s ease',
                        pointerEvents: 'none',
                      }}
                    >
                      Last name
                    </label>
                  </>
                )}
              />
              {isSubmitted && errors.lastName && (
                <span style={{ color: '#dc3545', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.lastName.message}
                </span>
              )}
            </div>

            {/* Username */}
            <div style={{ position: 'relative', marginBottom: '1rem', height: '4rem' }}>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      placeholder=" "
                      style={{
                        width: '100%',
                        padding: '1rem 0.75rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #ced4da',
                        height: '3rem',
                        fontSize: '1rem',
                        ...(isSubmitted && errors.userName ? { borderColor: '#dc3545' } : {}),
                      }}
                    />
                    <label
                      style={{
                        position: 'absolute',
                        top: field.value ? '0.25rem' : '1rem',
                        left: '0.75rem',
                        fontSize: field.value ? '0.75rem' : '1rem',
                        color: '#6c757d',
                        transition: 'all 0.2s ease',
                        pointerEvents: 'none',
                      }}
                    >
                      Username
                    </label>
                  </>
                )}
              />
              {isSubmitted && errors.userName && (
                <span style={{ color: '#dc3545', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.userName.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div style={{ position: 'relative', marginBottom: '1rem', height: '4rem' }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      placeholder=" "
                      style={{
                        width: '100%',
                        padding: '1rem 0.75rem 0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #ced4da',
                        height: '3rem',
                        fontSize: '1rem',
                        ...(isSubmitted && errors.password ? { borderColor: '#dc3545' } : {}),
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        passwordOnChange(e.target.value);
                      }}
                    />
                    <label
                      style={{
                        position: 'absolute',
                        top: field.value ? '0.25rem' : '1rem',
                        left: '0.75rem',
                        fontSize: field.value ? '0.75rem' : '1rem',
                        color: '#6c757d',
                        transition: 'all 0.2s ease',
                        pointerEvents: 'none',
                      }}
                    >
                      Password
                    </label>
                  </>
                )}
              />
              {isSubmitted && errors.password && (
                <span style={{ color: '#dc3545', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Note for Edit Mode */}
            {!isAddNew && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: '#17a2b8', fontWeight: 'bold' }}>Note:</span>{' '}
                If you don’t intend to change the member password, leave the password field empty.
              </div>
            )}

            {/* Roles */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ width: '100px', lineHeight: '1.5' }}>Roles:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {applicationRoles.map((role) => (
                    <React.Fragment key={role}>
                      <input
                        type="checkbox"
                        id={role}
                        checked={watch('roles').split(',').includes(role)}
                        onChange={() => roleOnChange(role)}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor={role}
                        style={{
                          padding: '0.375rem 0.75rem',
                          border: '1px solid #007bff',
                          borderRadius: '0.25rem',
                          color: '#007bff',
                          cursor: 'pointer',
                          ...(watch('roles').split(',').includes(role) ? {
                            backgroundColor: '#007bff',
                            color: '#fff',
                          } : {}),
                        }}
                      >
                        {role}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {isSubmitted && errors.roles && (
                <div style={{ color: '#dc3545', fontSize: '0.875rem', marginLeft: '100px' }}>
                  {errors.roles.message}
                </div>
              )}
            </div>

            {/* Error Messages */}
            {errorMessages.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <ul style={{ color: '#dc3545', paddingLeft: '1.25rem', margin: 0 }}>
                  {errorMessages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', justifyContent: 'space-between' }}>
              <button
                type="submit"
                style={{
                  flex: '1',
                  padding: '0.5rem',
                  backgroundColor: '#17a2b8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                {isAddNew ? 'Create' : 'Update'} Member
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                style={{
                  flex: '1',
                  padding: '0.5rem',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Back to list
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddEditMember;